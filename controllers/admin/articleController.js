const { OkResponse } = require("../../cores/success.response")
const ArticleSerive = require("../../services/Article.service")

class articleController{
    getListArticle = async(req,res, next)=>{
        new OkResponse({
            message:"get list articles successfull",
            metadata:await ArticleSerive.getListArticle(req.query)
        }).send(res)
    }
    getArticleDetail = async(req, res, next)=>{
        new OkResponse({
            message:"get article detail successfull",
            metadata:await ArticleSerive.getArticleDetail(req.params)
        }).send(res)
    }
    createArticle = async(req, res,next)=>{
        new OkResponse({
            message:"create article successfull",
            metadata:await ArticleSerive.createArticle(req.body)
        }).send(res)
    }
    changeStatus = async(req,res, next)=>{
        new OkResponse({
            message:"change status successfull",
            metadata:await ArticleSerive.changeStatus(req.params)
        }).send(res)
    }
    deleteArticle = async(req, res, next)=>{
        new OkResponse({
            message:"delete article successfull",
            metadata:await ArticleSerive.deleteArticle(req.params)
        }).send(res)
    }
}
module.exports = new articleController()