
const Article = require("../models/Article.model")
const Source = require("../models/Source.model")
const Category = require("../models/Category.model")
const {Op} = require("@sequelize/core")

class ArticleSerive {
    static getListArticle = async (query) => {
        const {status, categoryId,page, limit, search } = query
        const whereCondition = {}
        if (status && status !== undefined) {
            whereCondition.status = status;
        }
        if (categoryId && categoryId !== undefined) {
            whereCondition.categoryId = categoryId;
        }
        if (search!={}) {
            whereCondition.title = { [Op.like]: `%${search}%` }; // Sử dụng Op.like để tìm kiếm
        }   

        const offset = (page-1) * limit
        const limitPerPage = parseInt(limit)
        const {count, rows} =  await Article.findAndCountAll({
            attributes: ["id",'title', 'thumbnail','status', 'createdAt'],
            include: [
                {
                    model: Category,
                    attributes: [["title", "categoryTitle"]], // Đặt alias cho trường `name` của Category
                },
            ],
            where: whereCondition,
            limit:limitPerPage,
            offset,
            order: [["createdAt", "DESC"]],
            raw:true,
        })
        return {
            total:count,
            totalPages: Math.ceil(count/limitPerPage)||1,
            currentPage:parseInt(page),
            articles:rows||[]
        }
    }
    static getArticleDetail = async({id})=>{
        return await Article.findOne({
            attributes:['id','title','thumbnail','status','content'],
            includes:[{
                model: Source,
                attributes:['name'],
            },{
                model:Category,
                attributes:['title']
            }],
            where:{id},
            raw:true
        })
    }
    static createArticle = async({title, content, status, CategoryId, SourceId, thumbnail})=>{
        return await Article.create({
            title:title,
            content:content,
            status:status,
            CategoryId:CategoryId,
            SourceId:SourceId,
            thumbnail:thumbnail
        })
    }
    static editArticle = async({id}, {title, content, status, CategoryId, SourceId, thumbnail})=>{
        return await Article.update({
            title:title,
            content:content,
            status:status,
            CategoryId:CategoryId,
            SourceId:SourceId,
            thumbnail:thumbnail
        },{where:{id}}
    )
    }
    static changeStatus = async({id, status})=>{
        return await Article.update({status},{where:{id}})
    }
    static deleteArticle = async({id})=>{
        return await Article.destroy({where:{id}})
    }
}
module.exports = ArticleSerive