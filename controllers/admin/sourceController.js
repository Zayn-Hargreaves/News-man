const { OkResponse } = require("../../cores/success.response")
const SourceService = require("../../services/Source.service")

class sourceController{
    getListSource = async(req, res, next)=>{
        new OkResponse({
            metadata: await SourceService.getListSource()
        }).send(res)
    }
    getSourceDetail = async(req, res, next)=>{
        new OkResponse({
            metadata:await SourceService.getSourceDetail(req.params)
        }).send(res)
    }
    addNewSource = async(req, res, next)=>{
        new OkResponse({
            metadata:await SourceService.addNewSource(req.body)
        }).send(res)
    }
    updateSource = async(req, res, next)=>{
        new OkResponse({
            metadata:await SourceService.addNewSource(req.body)
        }).send(res)
    }
    deleteSource = async(req, res, next)=>{
        new OkResponse({
            metadata:await SourceService.deleteSource(req.params)
        }).send(res)
    }
    changeStatus = async(req, res, next)=>{
        new OkResponse({
            metadata:await SourceService.changeStatus(req.params)
        }).send(res)
    }
    changeMulti = async(req, res,next)=>{
        new OkResponse({
            metadata:await SourceService.changeMulti(req.body)
        }).send(res)
    }
}

module.exports = new sourceController()