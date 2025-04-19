const UsedAdminRefreshToken = require("../models/UsedAdminRefreshToken")
const {where} = require("@sequelize/core")
class UsedAdminRefreshTokenService{
    static InsertUsedRefreshToken = async(AccountId, token)=>{
        return await UsedAdminRefreshToken.create({
            usedAdminRefreshTokenValue :token,
            AccountId:AccountId
        })
    }
    static FindToken = async(refreshToken)=>{
        return await UsedAdminRefreshToken.findOne({
            where:{
                usedAdminRefreshTokenValue:refreshToken
            },
            raw:true
        })
    }
}
module.exports = UsedAdminRefreshTokenService