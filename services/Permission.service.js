const Permission = require("../models/PermissionAdmin.model")
const RolePermission = require("../models/RolePermission.model")

class PermissionService{
    static getAllPermissions = async()=>{
        return await Permission.findAll({raw:true})
    }
    static getRolePermssions = async()=>{
        return await RolePermission.findAll({raw:true})
    }
    static addPermission = async(RoleId, PermissionId)=>{
        const [result, created] = await RolePermission.upsert({RoleId, PermissionId}, {where:{
            RoleId,
            PermissionId
        }})
        return result
    }
    static deletePermission = async(RoleId, PermissionId)=>{
        return await Role.destroy({where:{RoleId, PermissionId}})
    }
    
}
module.exports = PermissionService