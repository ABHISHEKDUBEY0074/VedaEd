import React from 'react';

const PermissionGuard = ({ requiredPermission, children }) => {
  const permissionsString = localStorage.getItem("permissions");
  let userPermissions = [];
  try {
    userPermissions = permissionsString ? JSON.parse(permissionsString) : [];
  } catch (e) {
    userPermissions = [];
  }

  if (userPermissions.includes(requiredPermission)) {
    return <>{children}</>;
  }

  return null;
};

export default PermissionGuard;
