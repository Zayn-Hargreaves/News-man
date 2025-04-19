const { ConflictError } = require("../cores/error.response")
const Category = require("../models/Category.model")
const { Op } = require("@sequelize/core")
const {CreateTree} = require("../helpers/CreateTree")
class CategoryService {
    static getListCategory = async (query) => {
        const { status, parentCategory, page, limit, search } = query
        console.log(query)
        const whereCondition = {}
        if (status != "") {
            whereCondition.status = status
        }
        if (parentCategory != "") {
            whereCondition.ParentId = parentCategory
        }
        if (search != "") {
            whereCondition.title = { [Op.like]: `%${search}%` }
        }
        console.log(whereCondition)
        const offset = (page - 1) * limit;
        const limitPerPage = parseInt(limit);
        const { count, rows } = await Category.findAndCountAll({
            attributes: ['id', 'title', 'status'], // Thêm parentId vào attributes
            include: [
                {
                    association: Category.associations.parent, // Thêm quan hệ với danh mục cha
                    attributes: ['id', 'title'], // Lấy thông tin danh mục cha
                }
            ],
            where: whereCondition,
            limit: limitPerPage,
            offset,
            raw: true
        });
        return {
            total: count,
            totalPages: Math.ceil(count / limitPerPage),
            currentPage: parseInt(page),
            categories: rows
        }
    }
    static getTreeCategory = async () => {
        const categories = await Category.findAll({
            attributes: ['id', 'title'],
            where: {
                status: "active"
            },
            raw: true
        })
        
        return CreateTree(categories)
    }
    static addCategory = async ({ title, status, ParentId }) => {
        const holderCategory = await Category.findOne({ where: { title } })
        if (holderCategory) throw new ConflictError("Category exists")
        return await Category.create({ title, status, ParentId })
    }
    static updateCategory = async ({ id }, { title, status, parentId }) => {
        return await Category.update({ title, status, parentId }, { where: { id } })
    }
    static changeMulti = async ({ ids, status }) => {
        return await Category.update({ status },
            { where: { id: ids } }
        )
    }
    static changeStatus = async ({ id, status }) => {
        console.log("hre")
        return await Category.update({ status: status }, { where: { id } })
    }
    static deteleCategory = async ({ id }) => {
        return await Category.destroy({ where: { id } })
    }
    static getCategoryDetail = async ({ id }) => {
        return await Category.findByPk(id, {
            attributes: ['title', 'status', 'ParentId']
        })
    }
}
module.exports = CategoryService