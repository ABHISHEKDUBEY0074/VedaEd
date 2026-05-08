const Role = require("../models/Role");
const RolePermission = require("../models/RolePermission");
const Permission = require("../models/Permission");

async function roleHasPermission(roleName, permissionName) {
  if (!roleName) return false;
  const normalized =
    typeof roleName === "string" ? roleName.toLowerCase() : roleName;
  const role = await Role.findOne({ name: normalized });
  if (!role) return false;
  const permission = await Permission.findOne({ name: permissionName });
  if (!permission) return false;
  const rolePermission = await RolePermission.findOne({
    roleId: role._id,
    permissionId: permission._id,
  });
  return !!rolePermission;
}

/**
 * Allows full student editors, or teachers/students with view_student
 * (assignment / self checks are enforced in updateStudentHealth).
 */
const studentHealthUpdateMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const r = req.user.role.toLowerCase();
    const hasEditStudent = await roleHasPermission(r, "edit_student");
    if (hasEditStudent) return next();

    const hasViewStudent = await roleHasPermission(r, "view_student");
    if (hasViewStudent && (r === "teacher" || r === "student")) {
      return next();
    }

    return res
      .status(403)
      .json({ message: "Forbidden: Insufficient permissions" });
  } catch (error) {
    console.error("studentHealthUpdateMiddleware:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = studentHealthUpdateMiddleware;
