
const { OkResponse } = require("../../cores/success.response")
const PermissionService = require("../../services/Permission.service")

class PermissionController{
    getListPermission=async(req, res, next)=>{
        new OkResponse({
            message:"get list permission success",
            metadata: await PermissionService.getAllPermissions()
        }).send(res)
    }
    getRolePermssion = async(req, res, next)=>{
        new OkResponse({
            message:"get role permssion",
            metadata: await PermissionService.getRolePermssions()
        }).send(res)
    }
    addPermission= async(req, res, next)=>{
        new OkResponse({
            message:"add permission success",
            metadata: await PermissionService.addPermission(req.params)
        }).send(res)
    }
    deletePermission = async(req, res, next)=>{
        new OkResponse({
            message:"delete permission success",
            metadata: await PermissionService.deletePermission(req.params)
        }).send(res)
    }
}
module.exports = new PermissionController()