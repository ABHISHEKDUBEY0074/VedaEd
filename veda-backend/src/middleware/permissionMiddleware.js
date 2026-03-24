const Role = require('../models/Role');
const RolePermission = require('../models/RolePermission');
const Permission = require('../models/Permission');

const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      // If the user is an admin, they might have all permissions or bypass
      // but let's strictly check permissions based on the role structure
      const role = await Role.findOne({ name: req.user.role });
      if (!role) {
        return res.status(403).json({ message: 'Role not found' });
      }

      const permission = await Permission.findOne({ name: requiredPermission });
      if (!permission) {
        return res.status(403).json({ message: `Permission '${requiredPermission}' does not exist` });
      }

      const rolePermission = await RolePermission.findOne({
        roleId: role._id,
        permissionId: permission._id
      });

      if (!rolePermission) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Permission Middleware Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

module.exports = permissionMiddleware;
