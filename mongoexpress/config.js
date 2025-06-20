import fs from 'node:fs';
import * as dotenv from 'dotenv';

dotenv.config();

let mongo = {
  connectionString: process.env.ME_CONFIG_MONGODB_SERVER ? '' : process.env.ME_CONFIG_MONGODB_URL,
  host: '127.0.0.1',
  port: '27017',
  dbName: '',
  username: '',
  password: '',
};

if (process.env.VCAP_SERVICES) {
  const dbLabel = 'mongodb-2.4';
  const env = JSON.parse(process.env.VCAP_SERVICES);
  if (env[dbLabel]) {
    mongo = env[dbLabel][0].credentials;
  }
}

const basicAuth = 'ME_CONFIG_BASICAUTH';
const basicAuthUsername = 'ME_CONFIG_BASICAUTH_USERNAME';
const basicAuthPassword = 'ME_CONFIG_BASICAUTH_PASSWORD';
const adminUsername = 'ME_CONFIG_MONGODB_ADMINUSERNAME';
const adminPassword = 'ME_CONFIG_MONGODB_ADMINPASSWORD';
const dbAuthUsername = 'ME_CONFIG_MONGODB_AUTH_USERNAME';
const dbAuthPassword = 'ME_CONFIG_MONGODB_AUTH_PASSWORD';

function getFile(filePath) {
  if (filePath !== undefined && filePath) {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath);
      }
    } catch (error) {
      console.error('Failed to read file', filePath, error);
    }
  }
  return null;
}

function getFileEnv(envVariable) {
  const origVar = process.env[envVariable];
  const fileVar = process.env[envVariable + '_FILE'];
  if (fileVar) {
    const file = getFile(fileVar);
    if (file) {
      return file.toString().split(/\r?\n/)[0].trim();
    }
  }
  return origVar;
}

const meConfigMongodbServer = process.env.ME_CONFIG_MONGODB_SERVER
  ? process.env.ME_CONFIG_MONGODB_SERVER.split(',')
  : false;

function getConnectionStringFromInlineParams() {
  const infos = {
    server: (
      meConfigMongodbServer.length > 1 ? meConfigMongodbServer : meConfigMongodbServer[0]
    ) ||  mongo.host || process.env.ME_CONFIG_MONGODB_SERVER || '127.0.0.1',
    port: mongo.port || process.env.ME_CONFIG_MONGODB_PORT || '27017',
    dbName: mongo.dbName || 'admin',
    username: mongo.username,
    password: mongo.password,
  };
  
  const login = infos.username
  ? `${encodeURIComponent(infos.username)}:${encodeURIComponent(infos.password)}@`
  : '';
  return `mongodb://${login}${infos.server}:${infos.port}/?authSource=admin&authMechanism=SCRAM-SHA-1`;
}

function getConnectionStringFromEnvVariables() {
  const infos = {
    server: (
      meConfigMongodbServer.length > 1 ? meConfigMongodbServer : meConfigMongodbServer[0]
    ) || mongo.host,
    port: process.env.ME_CONFIG_MONGODB_PORT || mongo.port,
    dbName: process.env.ME_CONFIG_MONGODB_AUTH_DATABASE || mongo.dbName,
    username: getFileEnv(adminUsername) || getFileEnv(dbAuthUsername) || mongo.username,
    password: getFileEnv(adminPassword) || getFileEnv(dbAuthPassword) || mongo.password,
  };
  const login = infos.username
  ? `${encodeURIComponent(infos.username)}:${encodeURIComponent(infos.password)}@`
  : '';
  return `mongodb://${login}${infos.server}:${infos.port}/?authSource=admin&authMechanism=SCRAM-SHA-1`;
}

function getBoolean(str, defaultValue = false) {
  return str ? str.toLowerCase() === 'true' : defaultValue;
}

// console.log("🚨 DEBUG CONNECTION STRING 🚨", mongo.connectionString || getConnectionStringFromEnvVariables());

export default {
  mongodb: {
    mongo,
    getConnectionStringFromInlineParams,
    connectionString: mongo.connectionString || getConnectionStringFromEnvVariables(),

    /** @type {import('mongodb').MongoClientOptions} */
    connectionOptions: {
      // ssl: connect to the server using secure SSL
      ssl: getBoolean(process.env.ME_CONFIG_MONGODB_SSL, mongo.ssl),

      // sslValidate: validate mongod server certificate against CA
      sslValidate: getBoolean(process.env.ME_CONFIG_MONGODB_SSLVALIDATE, true),

      // sslCA: single PEM file on disk
      sslCA: process.env.ME_CONFIG_MONGODB_CA_FILE,

      // maxPoolSize: size of connection pool (number of connections to use)
      maxPoolSize: 4,
    },

    // set admin to true if you want to turn on admin features
    // if admin is true, the auth list below will be ignored
    // if admin is true, you will need to enter an admin username/password below (if it is needed)
    admin: getBoolean(process.env.ME_CONFIG_MONGODB_ENABLE_ADMIN, false),

    // whitelist: hide all databases except the ones in this list  (empty list for no whitelist)
    whitelist: [],

    // blacklist: hide databases listed in the blacklist (empty list for no blacklist)
    blacklist: [],
  },

  site: {
    // baseUrl: the URL that mongo express will be located at - Remember to add the forward slash at the start and end!
    baseUrl: process.env.ME_CONFIG_SITE_BASEURL || '/',
    cookieKeyName: 'mongoexpress',
    cookieSecret: process.env.ME_CONFIG_SITE_COOKIESECRET || 'secret',
    host: process.env.VCAP_APP_HOST || 'localhost',
    port: process.env.PORT || 8081,
    requestSizeLimit: process.env.ME_CONFIG_REQUEST_SIZE || '50mb',
    sessionSecret: process.env.ME_CONFIG_SITE_SESSIONSECRET || 'secret',
    sslCert: process.env.ME_CONFIG_SITE_SSL_CRT_PATH || '',
    sslEnabled: getBoolean(process.env.ME_CONFIG_SITE_SSL_ENABLED, false),
    sslKey: process.env.ME_CONFIG_SITE_SSL_KEY_PATH || '',
  },

  healthCheck: {
    // path: the Path that mongo express healthcheck will be serve - Remember to add the forward slash at the start!
    path: process.env.ME_CONFIG_HEALTH_CHECK_PATH || '/status',
  },

  // set useBasicAuth to true if you want to authenticate mongo-express logins
  // if admin is false, the basicAuthInfo list below will be ignored
  // this will be false unless ME_CONFIG_BASICAUTH is set to the true
  useBasicAuth: getBoolean(getFileEnv(basicAuth)),

  basicAuth: {
    username: getFileEnv(basicAuthUsername) || 'admin',
    password: getFileEnv(basicAuthPassword) || 'pass',
  },

  options: {
    // Display startup text on console
    console: true,

    // documentsPerPage: how many documents you want to see at once in collection view
    documentsPerPage: 10,

    // editorTheme: Name of the theme you want to use for displaying documents
    // See http://codemirror.net/demo/theme.html for all examples
    editorTheme: process.env.ME_CONFIG_OPTIONS_EDITORTHEME || 'rubyblue',

    // Maximum size of a single property & single row
    // Reduces the risk of sending a huge amount of data when viewing collections
    maxPropSize: (100 * 1000), // default 100KB
    maxRowSize: (1000 * 1000), // default 1MB

    // The options below aren't being used yet

    // cmdType: the type of command line you want mongo express to run
    // values: eval, subprocess
    //   eval - uses db.eval. commands block, so only use this if you have to
    //   subprocess - spawns a mongo command line as a subprocess and pipes output to mongo express
    cmdType: 'eval',

    // subprocessTimeout: number of seconds of non-interaction before a subprocess is shut down
    subprocessTimeout: 300,

    // readOnly: if readOnly is true, components of writing are not visible.
    readOnly: getBoolean(process.env.ME_CONFIG_OPTIONS_READONLY, false),

    // persistEditMode: if set to true, remain on same page after clicked on Save button
    persistEditMode: getBoolean(process.env.ME_CONFIG_OPTIONS_PERSIST_EDIT_MODE, false),

    // collapsibleJSON: if set to true, jsons will be displayed collapsible
    collapsibleJSON: true,

    // collapsibleJSONDefaultUnfold: if collapsibleJSON is set to `true`, this defines default level
    //  to which JSONs are displayed unfolded; use number or "all" to unfold all levels
    collapsibleJSONDefaultUnfold: 1,

    // gridFSEnabled: if gridFSEnabled is set to 'true', you will be able to manage uploaded files
    // ( ak. grids, gridFS )
    gridFSEnabled: getBoolean(process.env.ME_CONFIG_SITE_GRIDFS_ENABLED, false),

    // logger: this object will be used to initialize router logger (morgan)
    logger: {},

    // confirmDelete: if confirmDelete is set to 'true', a modal for confirming deletion is
    // displayed before deleting a document/collection
    confirmDelete: false,

    // noExport: if noExport is set to true, we won't show export buttons
    noExport: false,

    // fullwidthLayout: if set to true an alternative page layout is used utilizing full window width
    fullwidthLayout: getBoolean(process.env.ME_CONFIG_OPTIONS_FULLWIDTH_LAYOUT, false),

    // noDelete: if noDelete is set to true, we won't show delete buttons
    noDelete: getBoolean(process.env.ME_CONFIG_OPTIONS_NO_DELETE, false),
  },
};
