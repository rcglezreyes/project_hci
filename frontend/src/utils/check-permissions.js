import { CONFIG } from 'src/config-global';

export const verifyPermissions = (permissions, system, module, operation) => {
  if (!permissions) {
    return false;
  }
  return permissions?.some(
    (permission) =>
      permission?.module_system?.system?.name.toLowerCase().includes(system.toLowerCase()) &&
      permission?.module_system?.name.toLowerCase().includes(module.toLowerCase()) &&
      permission?.name.toLowerCase().includes(operation.toLowerCase())
  );
};

export const verifyRole = (roles, role) => {
  if (!roles) {
    return false;
  }
  return roles?.some((r) => r.name.includes(role));
};

export const listRolesAndSubroles = (role) =>
  role?.toLowerCase().indexOf(CONFIG.roles.superadmin.toLowerCase()) !== -1
    ? [
        CONFIG.roles.superadmin,
        CONFIG.roles.administrator,
        CONFIG.roles.medicalStaff,
        CONFIG.roles.patient,
        CONFIG.roles.technical,
        CONFIG.roles.departmentChief,
      ]
    : role?.toLowerCase().indexOf(CONFIG.roles.administrator.toLowerCase()) !== -1
      ? [
          CONFIG.roles.administrator,
          CONFIG.roles.medicalStaff,
          CONFIG.roles.patient,
          CONFIG.roles.technical,
          CONFIG.roles.departmentChief,
        ]
      : role?.toLowerCase().indexOf(CONFIG.roles.departmentChief.toLowerCase()) !== -1
        ? [
            CONFIG.roles.departmentChief,
            CONFIG.roles.medicalStaff,
            CONFIG.roles.patient,
            CONFIG.roles.technical,
          ]
        : role?.toLowerCase().indexOf(CONFIG.roles.patient.toLowerCase()) !== -1
          ? [CONFIG.roles.patient]
          : role?.toLowerCase().indexOf(CONFIG.roles.medicalStaff.toLowerCase()) !== -1
            ? [CONFIG.roles.medicalStaff]
            : role?.toLowerCase().indexOf(CONFIG.roles.technical.toLowerCase()) !== -1
              ? [CONFIG.roles.technical]
              : [];

export const isSuperAdmin = (role) =>
  role?.toLowerCase().indexOf(CONFIG.roles.superadmin.toLowerCase()) !== -1;
export const isAdministrator = (role) =>
  role?.toLowerCase().indexOf(CONFIG.roles.administrator.toLowerCase()) !== -1;
export const isDepartmentChief = (role) =>
  role?.toLowerCase().indexOf(CONFIG.roles.departmentChief.toLowerCase()) !== -1;
export const isMedicalStaff = (role) =>
  role?.toLowerCase().indexOf(CONFIG.roles.medicalStaff.toLowerCase()) !== -1;
export const isPatient = (role) =>
  role?.toLowerCase().indexOf(CONFIG.roles.patient.toLowerCase()) !== -1;
export const isTechnical = (role) =>
  role?.toLowerCase().indexOf(CONFIG.roles.technical.toLowerCase()) !== -1;
