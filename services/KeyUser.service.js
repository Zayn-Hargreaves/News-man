const KeyUser = require("../models/KeyUser.model")

class KeyUserService{
    static createToken = async({AccountId, publicKey, refreshToken })=>{
        try {
            const [token, created] = await KeyUser.upsert({
                UserId:AccountId, 
                publicKey,
                refreshToken
            },{
                where:{AccountId},
                return:true
            })
            return token ? token.publicKey:null
        } catch (error) {
            console.error(error)
        }
    }
    static findByToken = async(token)=>{
        return await KeyUser.findOne({
            where:{
                refreshToken:token
            },
            raw:true
        })
    }
    static findByAccountId = async(AccountId)=>{
        return await KeyUser.findOne({
            where:{
                UserId:parseInt(AccountId)
            },
            raw:true
        })
    }
    static deleteByToken = async(token)=>{
        return await KeyUser.destroy({
            where:{
                refreshToken:token
            }
        })
    }
    static deleteByAccountId = async(AccountId)=>{
        return await KeyUser.destroy({
            where:{
                UserId:AccountId
            }
        })
    }
}

module.exports = KeyUserService