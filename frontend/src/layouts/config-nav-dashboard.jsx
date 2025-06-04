import { paths } from 'src/routes/paths';

import { listRolesAndSubroles } from 'src/utils/check-permissions';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  item: icon('ic-item'),
  shipment: icon('ic-shipment'),
  salesOrder: icon('ic-sale-order'),
  project: icon('ic-project'),
  stage: icon('ic-stage'),
  stageTask: icon('ic-stage-task'),
  task: icon('ic-task'),
  access: icon('ic-access'),
  radar: icon('ic-radar'),
  config: icon('ic-config'),
  specialty: icon('ic-specialty'),
  department: icon('ic-department'),
  disability: icon('ic-disability'),
  track: icon('ic-track'),
  diagnosis: icon('ic-diagnosis'),
  room: icon('ic-room'),
  patient: icon('ic-patient'),
};

const userLogged = JSON.parse(sessionStorage.getItem('userLogged'));

// const { countLostItems } = useDataContext();

// ----------------------------------------------------------------------

export const navData = () => [
  // export const navData = (countLostItems) => [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [{ title: 'Analytics', path: paths.dashboard.general.analytics, icon: ICONS.analytics }],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Patients',
        path: paths.dashboard.patient.root,
        icon: ICONS.patient,
        children: [
          { title: 'List', path: paths.dashboard.patient.list },
          { title: 'Create', path: paths.dashboard.patient.new },
        ],
      },
      ...(userLogged &&
      listRolesAndSubroles(userLogged?.data.user_role.name).includes(CONFIG.roles.administrator)
        ? [
            {
              title: 'Users',
              path: paths.dashboard.user.root,
              icon: ICONS.user,
              children: [
                { title: 'List', path: paths.dashboard.user.list },
                { title: 'Create', path: paths.dashboard.user.new },
              ],
            },
          ]
        : []),
      ...(userLogged &&
      listRolesAndSubroles(userLogged?.data.user_role.name).includes(CONFIG.roles.superadmin)
        ? [
            {
              title: 'Configuration',
              path: paths.dashboard.config.root,
              icon: ICONS.config,
              open: true,
              children: [
                {
                  title: 'Roles',
                  path: paths.dashboard.role.root,
                  icon: ICONS.access,
                  open: true,
                  children: [
                    {
                      title: 'List',
                      path: paths.dashboard.role.list,
                    },
                    {
                      title: 'Create',
                      path: paths.dashboard.role.new,
                    },
                  ],
                },
                {
                  title: 'Specialties',
                  path: paths.dashboard.specialty.root,
                  icon: ICONS.specialty,
                  open: true,
                  children: [
                    {
                      title: 'List',
                      path: paths.dashboard.specialty.list,
                    },
                    {
                      title: 'Create',
                      path: paths.dashboard.specialty.new,
                    },
                  ],
                },
                {
                  title: 'Departments',
                  path: paths.dashboard.department.root,
                  icon: ICONS.department,
                  open: true,
                  children: [
                    {
                      title: 'List',
                      path: paths.dashboard.department.list,
                    },
                    {
                      title: 'Create',
                      path: paths.dashboard.department.new,
                    },
                  ],
                },
                {
                  title: 'Disabilities',
                  path: paths.dashboard.disability.root,
                  icon: ICONS.disability,
                  open: true,
                  children: [
                    {
                      title: 'List',
                      path: paths.dashboard.disability.list,
                    },
                    {
                      title: 'Create',
                      path: paths.dashboard.disability.new,
                    },
                  ],
                },
                {
                  title: 'Diagnoses',
                  path: paths.dashboard.diagnosis.root,
                  icon: ICONS.diagnosis,
                  open: true,
                  children: [
                    {
                      title: 'List',
                      path: paths.dashboard.diagnosis.list,
                    },
                    {
                      title: 'Create',
                      path: paths.dashboard.diagnosis.new,
                    },
                  ],
                },
                {
                  title: 'Rooms',
                  path: paths.dashboard.room.root,
                  icon: ICONS.room,
                  open: true,
                  children: [
                    {
                      title: 'List',
                      path: paths.dashboard.room.list,
                    },
                    {
                      title: 'Create',
                      path: paths.dashboard.room.new,
                    },
                  ],
                },
                {
                  title: 'Track/Logs',
                  path: paths.dashboard.track.root,
                  icon: ICONS.track,
                  open: true,
                  children: [
                    {
                      title: 'List',
                      path: paths.dashboard.track.list,
                    },
                  ],
                },
              ],
            },
          ]
        : []),
    ],
  },
];
