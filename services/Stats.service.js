const Account = require("../models/Account.model");
const Article = require("../models/Article.model");
const User = require("../models/User.model");
const Comment = require("../models/Comment.model")
class StatsService{
    static getStats = async()=>{
        const totalNews = await Article.count();
        const inactiveNews = await Article.count({
            where:{
                status:'inactive',
            }
        })
        const activeNews = await Article.count({
            where:{
                status:'active',
            }
        })
        const totalAccount = await Account.count()
        const totalUser = await User.count()
        return {
            totalNews,inactiveNews, activeNews,totalAccount,totalUser
        }
    }
    static getCommentStats = async()=>{
        const numOfPendingComment = await Comment.count({
            where:{
                status:'pending',
            }
        })
        const numOfReportedComment = await Comment.count({
            where:{
                isReported:true
            }
        })
        return {numOfPendingComment, numOfReportedComment}
    }
}
module.exports = StatsService