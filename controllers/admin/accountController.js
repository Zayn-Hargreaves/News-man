const { OkResponse } = require("../../cores/success.response")
const AccountService = require("../../services/Account.service")

class AccountController{
    getListAccount = async(req,res,next)=>{
        new OkResponse({
            message:"get list account successfull", 
            metadata:await AccountService.getListAccount()
        }).send(res)
    }
    getAccountDetail = async(req, res, next)=>{
        new OkResponse({
            message:"get account detail succesfull",
            metadata:await AccountService.findByAccountId(req.params)
        }).send(res)
    }
    createAccount = async(req,res, next)=>{
        new OkResponse({
            message:'create account successfull',
            metadata:await AccountService.addNewAccount(req.body)
        }).send(res)
    }
    updateAccount = async(req, res,next)=>{
        new OkResponse({
            message:'update account successfull',
            metadata:await AccountService.updateAccount(req.params,req.body)
        }).send(res)
    }
    changePassword= async(req,res, next)=>{
        new OkResponse({
            message:'change password successfull',
            metadata:await AccountService.changePassword(req.body)
        }).send(res)
    }
    changeStatus = async(req,res, next)=>{
        console.log("controller parram:: ", req.params)
        new OkResponse({
            message:"change status successfull",
            metadata:await AccountService.changeStatus(req.params)
        }).send(res)
    }
    changeMulti = async(req, res, next)=>{
        new OkResponse({
            message:'change multi successfull',
            metadata:await AccountService.changeMulti(req.body)
        }).send(res)
    }
    deleteAccount = async(req,res, next)=>{
        new OkResponse({
            message:'delete account admin successfull',
            metadata:await AccountService.deleteAccount(req.params)
        }).send(res)
    }
}  

module.exports = new AccountController()