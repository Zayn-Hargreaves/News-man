const { OkResponse } = require("../../cores/success.response")
const UserService = require("../../services/User.service")

class UserController{
    getListUser = async(req, res, next)=>{
        new OkResponse({
            message:"get list user successfull",
            metadata:await UserService.getListAccount()
        }).send(res)
    }
    getUserDetail = async(req, res, next)=>{
        new OkResponse({
            message:'get user detail successfull',
            metadata:await UserService.getUserDetail(req.params)
        }).send(res)
    }
    changeStatus = async(req,res, next)=>{
        new OkResponse({
            message:'change status successfull',
            metadata:await UserService.changeStatus(req.params)
        }).send(res)
    }
    changeMulti = async(req,res, next)=>{
        new OkResponse({
            message:'change multi successfull',
            metadata:await UserService.changeMulti(req.body)
        }).send(res)
    }
}
module.exports = new UserController()