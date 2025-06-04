// src/contexts/DataContext.jsx
import React, { useMemo, useContext, createContext } from 'react';

import {
  _mock,
  useUsersQuery,
  useRoomsQuery,
  usePatientsQuery,
  useTrackingQuery,
  useUserRolesQuery,
  useDiagnosesQuery,
  useAdmissionsQuery,
  useDepartmentsQuery,
  useSpecialtiesQuery,
  useDisabilitiesQuery,
  useNotificationsQuery,
  useMedicalStaffsQuery,
} from 'src/_mock';

const DataContext = createContext();
export const useDataContext = () => useContext(DataContext);

// eslint-disable-next-line react/prop-types
export const DataProvider = ({ children }) => {
  const userLogged = useMemo(() => JSON.parse(sessionStorage.getItem('userLogged')), []);

  const {
    data: diagnoses,
    loading: loadingDiagnoses,
    error: errorDiagnoses,
    refetch: refetchDiagnoses,
  } = useDiagnosesQuery();
  const {
    data: admissions,
    loading: loadingAdmissions,
    error: errorAdmissions,
    refetch: refetchAdmissions,
  } = useAdmissionsQuery();
  const {
    data: users,
    loading: loadingUsers,
    error: errorUsers,
    refetch: refetchUsers,
  } = useUsersQuery();
  const {
    data: notifications,
    loading: loadingNotifications,
    error: errorNotifications,
    refetch: refetchNotifications,
  } = useNotificationsQuery(null, userLogged?.data.username, 1, 100);
  const {
    data: departments,
    loading: loadingDepartments,
    error: errorDepartments,
    refetch: refetchDepartments,
  } = useDepartmentsQuery();
  const {
    data: disabilities,
    loading: loadingDisabilities,
    error: errorDisabilities,
    refetch: refetchDisabilities,
  } = useDisabilitiesQuery();
  const {
    data: medicalStaffs,
    loading: loadingMedicalStaffs,
    error: errorMedicalStaffs,
    refetch: refetchMedicalStaffs,
  } = useMedicalStaffsQuery();
  const {
    data: patients,
    loading: loadingPatients,
    error: errorPatients,
    refetch: refetchPatients,
  } = usePatientsQuery();
  const {
    data: rooms,
    loading: loadingRooms,
    error: errorRooms,
    refetch: refetchRooms,
  } = useRoomsQuery();
  const {
    data: specialties,
    loading: loadingSpecialties,
    error: errorSpecialties,
    refetch: refetchSpecialties,
  } = useSpecialtiesQuery();
  const {
    data: userRoles,
    loading: loadingUserRoles,
    error: errorUserRoles,
    refetch: refetchUserRoles,
  } = useUserRolesQuery(['Superadmin']);
  const {
    data: tracks,
    loading: loadingTracks,
    error: errorTracks,
    refetch: refetchTracks,
  } = useTrackingQuery();

  const loading =
    loadingAdmissions ||
    loadingUsers ||
    loadingNotifications ||
    loadingDiagnoses ||
    loadingDepartments ||
    loadingDisabilities ||
    loadingMedicalStaffs ||
    loadingTracks ||
    loadingPatients ||
    loadingRooms ||
    loadingSpecialties ||
    loadingUserRoles;
  const error =
    errorAdmissions ||
    errorUsers ||
    errorNotifications ||
    errorDiagnoses ||
    errorDepartments ||
    errorDisabilities ||
    errorMedicalStaffs ||
    errorTracks ||
    errorPatients ||
    errorRooms ||
    errorSpecialties ||
    errorUserRoles;

  const _avatarUsers = useMemo(
    () =>
      users.map((user, index) => ({
        ...user,
        name: `${user.firstName} ${user.lastName}`,
        avatarUrl: user.avatarUrl ? user.avatarUrl : _mock.image.avatar(index),
      })),
    [users]
  );

  if (userLogged) {
    userLogged.data.avatarUrl = _avatarUsers.find(
      (user) => user.username === userLogged.data.username
    )?.avatarUrl;
    userLogged.data.name = _avatarUsers.find(
      (user) => user.username === userLogged.data.username
    )?.name;
  }

  localStorage.setItem('userLogged', JSON.stringify(userLogged));

  const loadedNotifications = useMemo(() => notifications || null, [notifications]);
  const loadedAdmissions = useMemo(() => admissions || [], [admissions]);
  const loadedUsers = useMemo(() => users || [], [users]);
  const loadedDepartments = useMemo(() => departments || [], [departments]);
  const loadedUserRoles = useMemo(() => userRoles || [], [userRoles]);
  const loadedDisabilities = useMemo(() => disabilities || [], [disabilities]);
  const loadedMedicalStaffs = useMemo(() => medicalStaffs || [], [medicalStaffs]);
  const loadedPatients = useMemo(() => patients || [], [patients]);
  const loadedRooms = useMemo(() => rooms || [], [rooms]);
  const loadedSpecialties = useMemo(() => specialties || [], [specialties]);
  const loadedDiagnoses = useMemo(() => diagnoses || [], [diagnoses]);
  const loadedTracks = useMemo(() => tracks || [], [tracks]);

  const value = useMemo(
    () => ({
      userLogged,
      loadedNotifications,
      loadedAdmissions,
      loadedUsers,
      loadedDepartments,
      loadedUserRoles,
      loadedDisabilities,
      loadedMedicalStaffs,
      loadedPatients,
      loadedRooms,
      loadedSpecialties,
      loadedDiagnoses,
      loadedTracks,
      loading,
      error,
      refetchAdmissions,
      refetchUsers,
      refetchNotifications,
      refetchDepartments,
      refetchUserRoles,
      refetchDisabilities,
      refetchMedicalStaffs,
      refetchPatients,
      refetchRooms,
      refetchSpecialties,
      refetchDiagnoses,
      refetchTracks,
    }),
    [
      userLogged,
      loadedNotifications,
      loadedAdmissions,
      loadedUsers,
      loadedDepartments,
      loadedUserRoles,
      loadedDisabilities,
      loadedMedicalStaffs,
      loadedPatients,
      loadedRooms,
      loadedSpecialties,
      loadedDiagnoses,
      loadedTracks,
      loading,
      error,
      refetchAdmissions,
      refetchUsers,
      refetchNotifications,
      refetchDepartments,
      refetchUserRoles,
      refetchDisabilities,
      refetchMedicalStaffs,
      refetchPatients,
      refetchRooms,
      refetchSpecialties,
      refetchDiagnoses,
      refetchTracks,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
