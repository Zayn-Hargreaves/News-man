const { createTokenPair } = require("../auth/authUtils");
const { NotFoundError, UnauthorizedError } = require("../cores/error.response");
const Account = require("../models/Account.model")
const AccountService = require("./account.service")
const bcrypt = require("bcrypt")
class AuthService{
    static login = async({email, password, resfreshToken = null})=>{
        const account = AccountService.findByEmail({email});
        if(!account){
            throw new NotFoundError("Account not found")
        }
        const match = await bcrypt.compare(password,account.password)
        if(!match){
            throw new UnauthorizedError("Invalid email or password")
        }
        const privateKey = crypto.randomBytes(64).toString("hex")
        const publicKey = crypto.randomBytes(64).toString("hex")
        const tokens = await createTokenPair(
            {userId,email},
            publicKey,
            privateKey
        )
    }
}