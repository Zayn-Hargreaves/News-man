const { OkResponse } = require("../../cores/success.response")
const StatsService = require("../../services/Stats.service")

class statsController {
    getStats = async(req, res, next)=>{
        new OkResponse({
            message: "get stats success",
            metadata: await StatsService.getStats()
        }).send(res)
    }
    getCommentStats = async (req,res, next)=>{
        new OkResponse({
            message:"get comment stats success", 
            metadata: await StatsService.getCommentStats()
        }).send(res)
    }
}

module.exports = new statsController()