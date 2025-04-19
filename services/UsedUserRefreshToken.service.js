const UsedUserRefreshToken = require("../models/UsedUserRefreshToken")


class UsedUserRefreshTokenService{
    static InsertUsedRefreshToken = async(AccountId, token)=>{
        return await UsedUserRefreshToken.create({
            usedUserRefreshTokenValue :token,
            UserId:AccountId
        })
    }
    static FindToken = async(refreshToken)=>{
        return await UsedAdminRefreshToken.findOne({
            where:{
                usedUserRefreshTokenValue:refreshToken
            },
            raw:true
        })
    }
}
module.exports = UsedUserRefreshTokenService