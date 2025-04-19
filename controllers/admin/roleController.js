const { OkResponse } = require("../../cores/success.response")
const RoleService = require("../../services/Role.service")

class RoleController{
    createRole = async(req,res,next)=>{
        new OkResponse({
            message:"create role successfull",
            metadata: await RoleService.createRole(req.body)
        }).send(res)
    }
    getListRole = async(req, res,next)=>{
        new OkResponse({
            message:"get list role successfull",
            metadata:await RoleService.getListRole()
        }).send(res)
    }
    deleteRoel = async(req, res,next)=>{
        new OkResponse({
            message:"delete role successfull",
            metadata:await RoleService.deleteRole(req.params)
        }).send(res)
    }
    getRoleDetail = async(req, res, next)=>{
        new OkResponse({
            message:"get role detail success",
            metadata: await RoleService.getRoleDetail(req.params)
        }).send(res)
    }
    editRole = async(req,res, next)=>{
        console.log(req.body)
        new OkResponse({
            message:"update role success",
            metadata:await RoleService.editRole(req.params, req.body)
        }).send(res)
    }
}
module.exports = new RoleController()