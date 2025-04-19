const router = require("express").Router()
const PermissionController = require("../../../controllers/admin/permissionController")
const { asyncHandler } = require('../../../helpers/asyncHandler')
router.get("/", asyncHandler(PermissionController.getListPermission))
router.get("/role", asyncHandler(PermissionController.getRolePermssion))
router.post("/role/edit/:RoleId/:PermissionId", asyncHandler(PermissionController.addPermission))
router.delete("/role/delete/:RoleId/:PermissionId", asyncHandler(PermissionController.deletePermission))
module.exports = router