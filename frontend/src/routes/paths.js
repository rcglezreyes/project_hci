import { CONSTANTS } from 'src/constants-global';

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  DASHBOARD_CONFIG: '/dashboard/config',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/sign-in`,
      signUp: `${ROOTS.AUTH}/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}/analytics`,
    general: {
      analytics: `${ROOTS.DASHBOARD}/analytics`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    },
    config: {
      root: `${ROOTS.DASHBOARD_CONFIG}`,
    },
    role: {
      root: `${ROOTS.DASHBOARD_CONFIG}/role`,
      list: `${ROOTS.DASHBOARD_CONFIG}/role/list`,
      new: `${ROOTS.DASHBOARD_CONFIG}/role/new`,
      details: (id) => `${ROOTS.DASHBOARD_CONFIG}/role/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD_CONFIG}/role/${id}/edit`,
    },
    specialty: {
      root: `${ROOTS.DASHBOARD_CONFIG}/specialty`,
      list: `${ROOTS.DASHBOARD_CONFIG}/specialty/list`,
      new: `${ROOTS.DASHBOARD_CONFIG}/specialty/new`,
      details: (id) => `${ROOTS.DASHBOARD_CONFIG}/specialty/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD_CONFIG}/specialty/${id}/edit`,
    },
    department: {
      root: `${ROOTS.DASHBOARD_CONFIG}/department`,
      list: `${ROOTS.DASHBOARD_CONFIG}/department/list`,
      new: `${ROOTS.DASHBOARD_CONFIG}/department/new`,
      details: (id) => `${ROOTS.DASHBOARD_CONFIG}/department/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD_CONFIG}/department/${id}/edit`,
    },
    disability: {
      root: `${ROOTS.DASHBOARD_CONFIG}/disability`,
      list: `${ROOTS.DASHBOARD_CONFIG}/disability/list`,
      new: `${ROOTS.DASHBOARD_CONFIG}/disability/new`,
      details: (id) => `${ROOTS.DASHBOARD_CONFIG}/disability/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD_CONFIG}/disability/${id}/edit`,
    },
    room: {
      root: `${ROOTS.DASHBOARD_CONFIG}/room`,
      list: `${ROOTS.DASHBOARD_CONFIG}/room/list`,
      new: `${ROOTS.DASHBOARD_CONFIG}/room/new`,
      details: (id) => `${ROOTS.DASHBOARD_CONFIG}/room/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD_CONFIG}/room/${id}/edit`,
    },
    diagnosis: {
      root: `${ROOTS.DASHBOARD_CONFIG}/diagnosis`,
      list: `${ROOTS.DASHBOARD_CONFIG}/diagnosis/list`,
      new: `${ROOTS.DASHBOARD_CONFIG}/diagnosis/new`,
      details: (id) => `${ROOTS.DASHBOARD_CONFIG}/diagnosis/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD_CONFIG}/diagnosis/${id}/edit`,
    },
    track: {
      root: `${ROOTS.DASHBOARD_CONFIG}/track`,
      list: `${ROOTS.DASHBOARD_CONFIG}/track/list`,
    },
    patient: {
      root: `${ROOTS.DASHBOARD}/patient`,
      list: `${ROOTS.DASHBOARD}/patient/list`,
      new: `${ROOTS.DASHBOARD}/patient/new`,
      details: (id) => `${ROOTS.DASHBOARD}/patient/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/patient/${id}/edit`,
    },
    admission: {
      root: `${ROOTS.DASHBOARD}/admission`,
      list: `${ROOTS.DASHBOARD}/admission/list`,
      new: `${ROOTS.DASHBOARD}/admission/new`,
      details: (id) => `${ROOTS.DASHBOARD}/admission/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/admission/${id}/edit`,
    },
    medicalStaff: {
      root: `${ROOTS.DASHBOARD}/medical-staff`,
      list: `${ROOTS.DASHBOARD}/medical-staff/list`,
      new: `${ROOTS.DASHBOARD}/medical-staff/new`,
      details: (id) => `${ROOTS.DASHBOARD}/medical-staff/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/medical-staff/${id}/edit`,
    },
  },
  backend: {
    api: {
      baseUrl: CONSTANTS.apiUrl,
      login: `${CONSTANTS.apiUrl}/auth/login/`,
      logout: `${CONSTANTS.apiUrl}/auth/logout/`,
      main: {
        department: {
          create: `${CONSTANTS.apiUrl}/main/create/department/`,
          update: (id) => `${CONSTANTS.apiUrl}/main/update/department/${id}/`,
          delete: (id) => `${CONSTANTS.apiUrl}/main/delete/department/${id}/`,
          deleteAll: `${CONSTANTS.apiUrl}/main/delete/department/`,
        },
        disability: {
          create: `${CONSTANTS.apiUrl}/main/create/disability/`,
          update: (id) => `${CONSTANTS.apiUrl}/main/update/disability/${id}/`,
          delete: (id) => `${CONSTANTS.apiUrl}/main/delete/disability/${id}/`,
          deleteAll: `${CONSTANTS.apiUrl}/main/delete/disability/`,
        },
        specialty: {
          create: `${CONSTANTS.apiUrl}/main/create/specialty/`,
          update: (id) => `${CONSTANTS.apiUrl}/main/update/specialty/${id}/`,
          delete: (id) => `${CONSTANTS.apiUrl}/main/delete/specialty/${id}/`,
          deleteAll: `${CONSTANTS.apiUrl}/main/delete/specialty/`,
        },
        room: {
          create: `${CONSTANTS.apiUrl}/main/create/room/`,
          update: (id) => `${CONSTANTS.apiUrl}/main/update/room/${id}/`,
          delete: (id) => `${CONSTANTS.apiUrl}/main/delete/room/${id}/`,
          deleteAll: `${CONSTANTS.apiUrl}/main/delete/room/`,
        },
        diagnosis: {
          create: `${CONSTANTS.apiUrl}/main/create/diagnosis/`,
          update: (id) => `${CONSTANTS.apiUrl}/main/update/diagnosis/${id}/`,
          delete: (id) => `${CONSTANTS.apiUrl}/main/delete/diagnosis/${id}/`,
          deleteAll: `${CONSTANTS.apiUrl}/main/delete/diagnosis/`,
        },
        patient: {
          create: `${CONSTANTS.apiUrl}/main/create-patient/`,
          update: (id) => `${CONSTANTS.apiUrl}/main/update-patient/${id}/`,
          delete: (id) => `${CONSTANTS.apiUrl}/main/delete-patient/${id}/`,
          deleteAll: `${CONSTANTS.apiUrl}/main/delete-patient/`,
        },
        medicalStaff: {
          create: `${CONSTANTS.apiUrl}/main/create-medical-staff/`,
          update: (id) => `${CONSTANTS.apiUrl}/main/update-medical-staff/${id}/`,
          delete: (id) => `${CONSTANTS.apiUrl}/main/delete-medical-staff/${id}/`,
          deleteAll: `${CONSTANTS.apiUrl}/main/delete-medical-staff/`,
        },
        admission: {
          create: `${CONSTANTS.apiUrl}/main/create-admission/`,
          update: (id) => `${CONSTANTS.apiUrl}/main/update-admission/${id}/`,
          delete: (id) => `${CONSTANTS.apiUrl}/main/delete-admission/${id}/`,
          deleteAll: `${CONSTANTS.apiUrl}/main/delete-admission/`,
        },
        notification: {
          deleteAll: `${CONSTANTS.apiUrl}/main/delete-notifications/`,
          markReadAll: `${CONSTANTS.apiUrl}/main/mark-read/notifications/`,
        },
      },
      users: {
        userRole: {
          create: `${CONSTANTS.apiUrl}/users/create/user-role/`,
          update: (id) => `${CONSTANTS.apiUrl}/users/update/user-role/${id}/`,
          delete: (id) => `${CONSTANTS.apiUrl}/users/delete/user-role/${id}/`,
          deleteAll: `${CONSTANTS.apiUrl}/users/delete/user-roles/`,
        },
        user: {
          create: `${CONSTANTS.apiUrl}/users/create/user/`,
          update: (id) => `${CONSTANTS.apiUrl}/users/update/user/${id}/`,
          delete: (id) => `${CONSTANTS.apiUrl}/users/delete/user/${id}/`,
          deleteAll: `${CONSTANTS.apiUrl}/users/delete/users/`,
        },
      },
    },
    websocket: {
      main: {
        departments: `wss://${CONSTANTS.apiHost}/api/main/ws/departments/`,
        disabilities: `wss://${CONSTANTS.apiHost}/api/main/ws/disabilities/`,
        specialties: `wss://${CONSTANTS.apiHost}/api/main/ws/specialties/`,
        rooms: `wss://${CONSTANTS.apiHost}/api/main/ws/rooms/`,
        diagnoses: `wss://${CONSTANTS.apiHost}/api/main/ws/diagnoses/`,
        patients: `wss://${CONSTANTS.apiHost}/api/main/ws/patients/`,
        admissions: `wss://${CONSTANTS.apiHost}/api/main/ws/admissions/`,
        medicalStaff: `wss://${CONSTANTS.apiHost}/api/main/ws/medical-staffs/`,
        notifications: `wss://${CONSTANTS.apiHost}/api/main/ws/notifications/`,
        tracks: `wss://${CONSTANTS.apiHost}/api/main/ws/tracks/`,
      },
      users: {
        userRoles: `wss://${CONSTANTS.apiHost}/api/users/ws/user-roles/`,
        users: `wss://${CONSTANTS.apiHost}/api/users/ws/users/`,
      },
    },
    graphql: {
      main: {
        baseUrl: `${CONSTANTS.apiUrl}/main/graphql/`,
      },
      users: {
        baseUrl: `${CONSTANTS.apiUrl}/users/graphql/`,
      },
    },
  },
};
