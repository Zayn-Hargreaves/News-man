const { OkResponse } = require("../../cores/success.response")
const CommentService = require("../../services/comment.service")

class CommentController{
    getListComment = async(req, res, next)=>{
        new OkResponse({
            message:"get list comment successfull",
            metadata:await CommentService.getListComment(req.query)
        }).send(res)
    }
    changeStatus = async(req, res, next)=>{
        new OkResponse({
            message:"change status successfull",
            metadata:await CommentService.changeStatus(req.params)
        }).send(res)
    }
    changeMulti = async(req, res,next)=>{
        new OkResponse({
            message:"change status successfull",
            metadata:await CommentService.changeMulti(req.body)
        }).send(res)
    }
    deleteComment = async(req, res, next)=>{
        new OkResponse({
            message:'delete comment successfull',
            metadata:await CommentService.deleteComment(req.params)
        }).send(res)
    }
}
module.exports = new CommentController();