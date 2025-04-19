const { BadRequestError, ConflictError, UnauthorizedError } = require("../cores/error.response")
const Account = require("../models/Account.model")
const bcrypt = require("bcrypt")
const { getInfoData } = require("../utils")
const Category = require("../models/Category.model")
const Role = require("../models/RoleAdmin.model")
class AccountService {
    static findByEmail = async ({ email}) => {
        return await Account.findOne({
            where: { email },
            raw: true
        })
    }
    static findByAccountId = async ({ id, select = ['id','email', 'password', 'name', 'status', 'RoleId'] }) => {
        return await Account.findByPk(id, {
            attributes: select,
            include:[
                {
                    model:Category,
                    attributes:['title']
                },
                {
                    model:Role,
                    attributes:['title']
                }
            ],
            raw: true
        })
    }
    static addNewAccount = async ({ name, email, password, CategoryId, RoleId, status, avatar }) => {
        console.log("data:::::",name, email, password, CategoryId, RoleId, status, avatar)
        const holderAccount = await this.findByEmail({email})
        if (holderAccount) throw new BadRequestError("Email is registered")
        const passwordHash = await bcrypt.hash(password, 10)

        const newAccount = Account.create({ name, email, password:passwordHash, CategoryId, RoleId, status, avatar })
        if (!newAccount) throw new BadRequestError("Account create failed")
        return {
            account: getInfoData({
                fields: ["id", 'name', 'email', 'CategoryId', 'RoleId', 'status','avatar'],
                object:newAccount
            })
        }
    }
    static getListAccount = async()=>{
        return await Account.findAll({
            attributes:['id','name','email','status','avatar'],
            include:[
                {
                    model:Category,
                    attributes:['title']
                },
                {
                    model:Role,
                    attributes:['title']
                }
            ],
            raw:true
        })
    }
   
    static changeStatus = async({id, status})=>{
        console.log("test::::",id, status)
        return await Account.update({status},{where:{id}})
    }
    static updateAccount = async({id},{name, email, CategoryId, RoleId, avatar})=>{
        return await Account.update({name,email, CategoryId, RoleId, avatar},{where:{id}})
    }
    static changeMulti = async({ids, status})=>{
        return await Account.update({status}, {where:{ids}})
    }
    static deleteAccount = async({id})=>{
        return await Account.destroy({where:{id}})
    }
    static changePassword = async({id},{oldPassword, newPassword})=>{
        const holderAccount = await Account.findByPK(id)
        if(!holderAccount) throw new ConflictError("Account not found")
        const match = bcrypt.compare(oldPassword, holderAccount.password)
        if(!match) throw new UnauthorizedError("incorrect old password")
        const hashpassword = bcrypt.hash(newPassword,10);
        return await Account.update({password:hashpassword}, {where:{id}})
    }
}
module.exports = AccountService