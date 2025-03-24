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
// Medical Staff
const MedicalStaffListPage = lazy(() => import('src/pages/dashboard/medical-staff/list'));
const MedicalStaffCreatePage = lazy(() => import('src/pages/dashboard/medical-staff/new'));
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
        element:  <OverviewAnalyticsPage />,
      },
      {
        path: 'medical-staff',
        children: [
          {
            element: listRolesAndSubroles(user?.user_role?.name).includes(
                CONFIG.roles.departmentChief
            ) ? (
                <MedicalStaffListPage />
            ) : (
                <Page403 />
            ),
            index: true,
          },
          {
            path: 'list',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
                CONFIG.roles.departmentChief
            ) ? (
                <MedicalStaffListPage />
            ) : (
                <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
                CONFIG.roles.departmentChief
            ) ? (
                <MedicalStaffCreatePage />
            ) : (
                <Page403 />
            ),
          },
        ],
      },
      {
        path: 'patient',
        children: [
          {
            element: listRolesAndSubroles(user?.user_role?.name).includes(
                CONFIG.roles.medicalStaff
            ) ? (
                <PatientListPage />
            ) : (
                <Page403 />
            ),
            index: true,
          },
          {
            path: 'list',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.medicalStaff
            ) ? (
              <PatientListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.medicalStaff
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
              CONFIG.roles.departmentChief
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
              CONFIG.roles.departmentChief
            ) ? (
              <SpecialtyDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.departmentChief
            ) ? (
              <SpecialtyDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: ':id/edit',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.departmentChief
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
              CONFIG.roles.administrator
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
              CONFIG.roles.administrator
            ) ? (
              <DepartmentDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.administrator
            ) ? (
              <DepartmentDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: ':id/edit',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.administrator
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
              CONFIG.roles.medicalStaff
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
              CONFIG.roles.medicalStaff
            ) ? (
              <DisabilityDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.medicalStaff
            ) ? (
              <DisabilityDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: ':id/edit',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.medicalStaff
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
              CONFIG.roles.medicalStaff
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
              CONFIG.roles.medicalStaff
            ) ? (
              <DiagnosisDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.medicalStaff
            ) ? (
              <DiagnosisDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: ':id/edit',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.medicalStaff
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
              CONFIG.roles.technical
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
              CONFIG.roles.technical
            ) ? (
              <RoomDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: 'new',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.technical
            ) ? (
              <RoomDefaultCreatePage />
            ) : (
              <Page403 />
            ),
          },
          {
            path: ':id/edit',
            element: listRolesAndSubroles(user?.user_role?.name).includes(
              CONFIG.roles.technical
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
              CONFIG.roles.administrator
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
              CONFIG.roles.administrator
            ) ? (
              <TrackDefaultListPage />
            ) : (
              <Page403 />
            ),
          },
        ],
      },

      ...(user && listRolesAndSubroles(user?.user_role?.name).includes(CONFIG.roles.departmentChief)
        ? [
            {
              path: 'user',
              children: [
                {
                  element: listRolesAndSubroles(user?.user_role?.name).includes(
                      CONFIG.roles.departmentChief
                  ) ? (
                      <UserListPage />
                  ) : (
                      <Page403 />
                  ),
                  index: true,
                },
                {
                  path: 'list',
                  element: listRolesAndSubroles(user?.user_role?.name).includes(
                    CONFIG.roles.departmentChief
                  ) ? (
                    <UserListPage />
                  ) : (
                    <Page403 />
                  ),
                },
                {
                  path: 'new',
                  element: listRolesAndSubroles(user?.user_role?.name).includes(
                    CONFIG.roles.departmentChief
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
