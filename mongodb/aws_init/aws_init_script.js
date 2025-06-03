function _getEnv(variable) {
  if (typeof getenv === "function") {
    return getenv(variable);
  }
  return process.env[variable];
}

var rootUser = _getEnv("MONGO_INITDB_ROOT_USERNAME");
var rootPwd = _getEnv("MONGO_INITDB_ROOT_PASSWORD");
var rootDb = db.getSiblingDB('admin');

if (db.system.users.find({ user: rootUser }).count() === 0) {
  db.createUser({
    user: rootUser,
    pwd: rootPwd,
    roles: [{ role: "root", db: rootDb }]
  });
}

var dbUser = _getEnv("MONGO_DB_USERNAME");
var dbPwd = _getEnv("MONGO_DB_PASSWORD");
var dbName = _getEnv("MONGO_DB_DATABASE_NAME");

db = db.getSiblingDB(dbName);

if (db.system.users.find({ user: dbUser }).count() === 0) {
    db.createUser({
        user: dbUser,
        pwd: dbPwd,
        roles: [
            { role: "readWrite", db: dbName },
            { role: "dbAdmin", db: dbName }
        ]
    });
}

db.login.insertOne({ user: dbUser, password: dbPwd });