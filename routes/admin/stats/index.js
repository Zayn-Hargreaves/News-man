const router = require("express").Router()
const statsController = require("../../../controllers/admin/statsController")
const { asyncHandler } = require('../../../helpers/asyncHandler')

router.get("/", asyncHandler(statsController.getStats))
router.get("/comment", asyncHandler(statsController.getCommentStats))


module.exports = router