const Article = require("../models/Article.model")
const Comment = require("../models/Comment.model")
const User = require("../models/User.model")
const { Op } = require("@sequelize/core")
class CommentService {
    static getListComment = async (query) => {
        const page = query.page
        const limit = query.limit
        const offset = (page - 1) * limit
        const limitPerPage = parseInt(limit)
        const { count, rows } = await Comment.findAndCountAll({
            attributes: ['id', 'content', 'status', 'isReported', 'createdAt'],
            include: {
                model: User,
                attributes: ['name']
            },
            where: {
                [Op.or]: [
                    { isReported: true },
                    { status: 'pending' }
                ]
            },
            limit: limitPerPage,
            offset,
            order: [["createdAt", "DESC"]],
            raw: true
        });

        return {
            total: count,
            totalPages: Math.ceil(count / limitPerPage),
            currentPage: parseInt(page),
            comments: rows
        };
    }
    static changeStatus = async ({ id, status }) => {
        return await Article.update({ status }, { where: { id } })
    }
    static deleteComment = async ({ id }) => {
        return await Comment.destroy({ where: { id } })
    }
    static changeMulti = async ({ ids, status }) => {
        return await Article.update({ status }, { where: { ids } })
    }
}

module.exports = CommentService
// lay tat ca cac comment theo trang thai, theo report

// lay so luong comment theo trang thai va theo report

// chap nhan tat ca cac comment dang pendings

// nguoi dung tao comment

// xoa comment o phia nguoi dung (gui kem token va id o tren params de xoa di)

// xoa comment  

// xu ly phan like dislike