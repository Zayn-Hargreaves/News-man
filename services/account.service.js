const Account = require("../models/Account.model")

class AccountService{
    static findByEmail = async({email,select=['email', 'pasword', 'name','status']})=>{
        return await Account.findOne({
            where:{email},
            attributes:select,
            raw:true            
        })
    }
}
module.exports = AccountService