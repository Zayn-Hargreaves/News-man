const User = require("../models/User.model")


class UserService{
    static findByEmail = async({email,select=['email', 'password', 'name','status']})=>{
        return await User.findOne({
            where:{email},
            attributes:select,
            raw:true            
        })
    }
    static findByAccountId = async({AccountId,select=['email', 'password', 'name','status']})=>{
        return await User.findByPk(AccountId,{
            attributes:select,
            raw:true
        })
    }
    static getListAccount = async()=>{
        return await User.findAll({
            attributes:['email','name','status','avatar'],
            raw:true
        })
    }
    static getUserDetail = async({id})=>{
        return await User.findByPk(id,{
            attributes:['email','name', 'avatar'],
            raw:true
        })
    }
    static changeStatus = async({id, status})=>{
        return await User.update({status},{where:{id}})
    }
    static changeMulti = async({ids, status})=>{
        return await User.update({status}, {where:{ids}})
    }
    
}
module.exports = UserService