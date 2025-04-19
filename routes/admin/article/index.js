const router = require("express").Router()
const articleController = require("../../../controllers/admin/articleController")
const { asyncHandler } = require('../../../helpers/asyncHandler')

router.get('/', asyncHandler(articleController.getListArticle))

module.exports = router