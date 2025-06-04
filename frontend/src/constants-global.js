export const CONSTANTS = {
  appName: 'MEDICAL ADMISSION SYSTEM',
  serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',
  apiUrl: import.meta.env.VITE_BACKEND_URL ?? '',
  apiHost: import.meta.env.VITE_BACKEND_HOST ?? '',
  apiPort: import.meta.env.VITE_BACKEND_PORT ?? 543,
  apiDomain: import.meta.env.VITE_BACKEND_DOMAIN ?? '',
  pollingInterval: import.meta.env.VITE_POLLING_INTERVAL ?? 10000,
  frontendHost: import.meta.env.VITE_FRONTEND_HOST ?? '',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL ?? '',
  frontendPort: import.meta.env.VITE_FRONTEND_PORT ?? 3000,
};
