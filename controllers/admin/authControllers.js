const {CreatedResponse, SuccessResponse, OkResponse} = require("../../cores/success.response")
const AdminAuthService = require("../../services/authAdmin.service")
class authController {
    login = async (req, res, next) => {
        new OkResponse({
            message:"login success",
            metadata: await AdminAuthService.login(req.body)
        }).send(res)
    }
    logout = async(req,res,next)=>{
        new OkResponse({
            message:"logout sucsess",
            metadata:await AdminAuthService.logout(req.refreshToken)
        }).send(res)
    }
    handleRefreshToken = async(req, res, next)=>{
        new OkResponse({
            message:"refresh token sucess",
            metadata: await AdminAuthService.handleRefreshTokenAdmin({
                refreshToken:req.refreshToken,
                privateKey:req.privateKey,
                decode:req.decode
            })
        }).send(res)
    }
    signin = async(req,res, next)=>{
        new OkResponse({
            metadata: await AdminAuthService.signin(req.body)
        }).send(res)
    }
}

module.exports = new authController()