import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { listRolesAndSubroles } from 'src/utils/check-permissions';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// User
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
// User Roles
const UserRoleDefaultListPage = lazy(() => import('src/pages/dashboard/user-role/list'));
const UserRoleDefaultCreatePage = lazy(() => import('src/pages/dashboard/user-role/new'));
// Specialties
const SpecialtyDefaultListPage = lazy(() => import('src/pages/dashboard/specialty/list'));
const SpecialtyDefaultCreatePage = lazy(() => import('src/pages/dashboard/specialty/new'));
// Departments
const DepartmentDefaultListPage = lazy(() => import('src/pages/dashboard/department/list'));
const DepartmentDefaultCreatePage = lazy(() => import('src/pages/dashboard/department/new'));
// Disability
const DisabilityDefaultListPage = lazy(() => import('src/pages/dashboard/disability/list'));
const DisabilityDefaultCreatePage = lazy(() => import('src/pages/dashboard/disability/new'));
// Diagnosis
const DiagnosisDefaultListPage = lazy(() => import('src/pages/dashboard/diagnosis/list'));
const DiagnosisDefaultCreatePage = lazy(() => import('src/pages/dashboard/diagnosis/new'));
// Room
const RoomDefaultListPage = lazy(() => import('src/pages/dashboard/room/list'));
const RoomDefaultCreatePage = lazy(() => import('src/pages/dashboard/room/new'));
// Patient
const PatientListPage = lazy(() => import('src/pages/dashboard/patient/list'));
const PatientCreatePage = lazy(() => import('src/pages/dashboard/patient/new'));
// Track
const TrackDefaultListPage = lazy(() => import('src/pages/dashboard/track/list'));
// Error
const Page500 = lazy(() => import('src/pages/error/500'));
const Page403 = lazy(() => import('src/pages/error/403'));
const Page404 = lazy(() => import('src/pages/error/404'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = (listPermissions, user) => [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <OverviewAnalyticsPage /> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      {
        element: <IndexPage />,
        index: true,
      },
      {
        path: 'analytics',
        element: listRolesAndSubroles(user?.user_role?.name).includes(
          CONFIG.roles.projectManager
        ) ? (
          <OverviewAnalyticsPage />
        ) : (
          <Page403 />
        ),
      },
      {
        path: 'patient',
        children: [
          {
            path: 'list',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.projectManager
            ) ? (
              <PatientListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.projectManager
            ) ? (
              <PatientCreatePage />
            ) : (
              <Page403 />
            ),
          },
        ],
      },
      {
        path: 'config/role',
        children: [
          {
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <UserRoleDefaultListPage />
            ) : (
              <Page403 />
            ),
            index: true,
          },
          {
            path: 'list',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <UserRoleDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <UserRoleDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: ':id/edit',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <UserRoleDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
        ],
      },
      {
        path: 'config/specialty',
        children: [
          {
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <SpecialtyDefaultListPage />
            ) : (
              <Page403 />
            ),
            index: true,
          },
          {
            path: 'list',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <SpecialtyDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <SpecialtyDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: ':id/edit',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <SpecialtyDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
        ],
      },
      {
        path: 'config/department',
        children: [
          {
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DepartmentDefaultListPage />
            ) : (
              <Page403 />
            ),
            index: true,
          },
          {
            path: 'list',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DepartmentDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DepartmentDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: ':id/edit',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DepartmentDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
        ],
      },
      {
        path: 'config/disability',
        children: [
          {
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DisabilityDefaultListPage />
            ) : (
              <Page403 />
            ),
            index: true,
          },
          {
            path: 'list',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DisabilityDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DisabilityDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: ':id/edit',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DisabilityDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
        ],
      },
      {
        path: 'config/diagnosis',
        children: [
          {
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DiagnosisDefaultListPage />
            ) : (
              <Page403 />
            ),
            index: true,
          },
          {
            path: 'list',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DiagnosisDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DiagnosisDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: ':id/edit',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <DiagnosisDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
        ],
      },
      {
        path: 'config/room',
        children: [
          {
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <RoomDefaultListPage />
            ) : (
              <Page403 />
            ),
            index: true,
          },
          {
            path: 'list',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <RoomDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <RoomDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: ':id/edit',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <RoomDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
        ],
      },
      {
        path: 'config/track',
        children: [
          {
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <TrackDefaultListPage />
            ) : (
              <Page403 />
            ),
            index: true,
          },
          {
            path: 'list',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.superadmin
            ) ? (
              <TrackDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
        ],
      },

      ...(user && listRolesAndSubroles(user?.user_role?.name).includes(CONFIG.roles.projectManager)
        ? [
            {
              path: 'user',
              children: [
                {
                  path: 'list',
                  element: listRolesAndSubroles(user?.user_role?.name).includes(
                    CONFIG.roles.projectManager
                  ) ? (
                    <UserListPage />
                  ) : (
                    <Page403 />
                  ),
                },
                {
                  path: 'new',
                  element: listRolesAndSubroles(user?.user_role?.name).includes(
                    CONFIG.roles.projectManager
                  ) ? (
                    <UserCreatePage />
                  ) : (
                    <Page403 />
                  ),
                },
              ],
            },
          ]
        : []),
    ],
  },
];
