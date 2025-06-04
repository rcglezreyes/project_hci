import { paths } from 'src/routes/paths';

import packageJson from '../package.json';
import { CONSTANTS } from './constants-global';

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: 'MEDICAL ADMISSION SYSTEM',
  appVersion: packageJson.version,
  serverUrl: CONSTANTS.serverUrl,
  assetsDir: CONSTANTS.assetsDir,
  apiVersion: CONSTANTS.apiVersion,
  apiUrl: CONSTANTS.apiUrl,
  apiHost: CONSTANTS.apiHost,
  apiPort: CONSTANTS.apiPort,
  apiDomain: CONSTANTS.apiDomain,
  pollingInterval: CONSTANTS.pollingInterval,
  frontendHost: CONSTANTS.frontendHost,
  frontendUrl: CONSTANTS.frontendUrl,
  frontendPort: CONSTANTS.frontendPort,
  roles: {
    superadmin: import.meta.env.VITE_ROLE_SUPERADMIN ?? '',
    administrator: import.meta.env.VITE_ROLE_ADMINISTRATOR ?? '',
    medicalStaff: import.meta.env.VITE_ROLE_MEDICAL_STAFF ?? '',
    departmentChief: import.meta.env.VITE_ROLE_DEPARTMENT_CHIEF ?? '',
    patient: import.meta.env.VITE_ROLE_PATIENT ?? '',
    technical: import.meta.env.VITE_ROLE_TECHNICAL ?? '',
  },
  /**
   * Auth
   * @method jwt | amplify | firebase | supabase | auth0
   */
  auth: {
    method: 'jwt',
    skip: false,
    redirectPath: paths.dashboard.root,
  },
  /**
   * Mapbox
   */
  mapboxApiKey: import.meta.env.VITE_MAPBOX_API_KEY ?? '',
  /**
   * Firebase
   */
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APPID ?? '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? '',
  },
  /**
   * Amplify
   */
  amplify: {
    userPoolId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_ID ?? '',
    userPoolWebClientId: import.meta.env.VITE_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID ?? '',
    region: import.meta.env.VITE_AWS_AMPLIFY_REGION ?? '',
  },
  /**
   * Auth0
   */
  auth0: {
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID ?? '',
    domain: import.meta.env.VITE_AUTH0_DOMAIN ?? '',
    callbackUrl: import.meta.env.VITE_AUTH0_CALLBACK_URL ?? '',
  },
  /**
   * Supabase
   */
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL ?? '',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  },
};
