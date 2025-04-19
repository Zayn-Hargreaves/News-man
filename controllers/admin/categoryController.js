const { OkResponse } = require ("../../cores/success.response")
const CategoryService = require ("../../services/Category.service")

class CategoryController{
    getListCategory = async (req, res, next)=>{
        new OkResponse({
            message:"get list category successfull",
            metadata: await CategoryService.getListCategory(req.query)
        }).send(res)
    }
    getTreeCategory = async(req, res, next)=>{
        new OkResponse({
            message:"get category detail successfull",
            metadata : await CategoryService.getTreeCategory()
        }).send(res)
    }
    addCategory = async(req,res, next)=>{
        console.log(req.body)
        new OkResponse({
            message:"create category successfull",
            metadata :await CategoryService.addCategory(req.body)
        }).send(res)
    }
    updateCategory = async(req, res, next)=>{
        new OkResponse({
            message:"update category successfull",
            metadata: await CategoryService.updateCategory(req.params,req.body)
        }).send(res)
    }
    getCategoryDetail = async(req, res, next)=>{
        new OkResponse({
            message:'get category detail successfull',
            metadata:await CategoryService.getCategoryDetail(req.params)
        }).send(res)
    }
    changeStatus = async(req, res, next)=>{
        new OkResponse({
            message:"change status successfull",
            metadata:await CategoryService.changeStatus(req.params)
        }).send(res)
    }
    deleteCategory = async(req, res, next)=>{
        new OkResponse({
            message:"delete category successfull",
            metadata:await CategoryService.deteleCategory(req.params)
        }).send(res)
    }
}

module.exports = new CategoryController()