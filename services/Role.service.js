const { ConflictError } = require("../cores/error.response")
const Role = require("../models/RoleAdmin.model")

class RoleService {
    static createRole = async({title, description})=>{
        return await Role.create({title, description})
    }
    static getListRole = async()=>{
        return await Role.findAll({
            raw:true
        })
    }
    static deleteRole = async({id})=>{
        return await Role.destroy({where:{id}})
    }
    static getRoleDetail = async({id})=>{
        return await Role.findByPk(id)
    }
    static editRole = async({id}, body)=>{
        console.log("id:::", id)
        console.log("body:::", body)

        return await Role.update(body,{where:{id}})
    }
}
module.exports = RoleService