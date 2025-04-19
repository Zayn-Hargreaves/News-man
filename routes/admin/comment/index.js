const router = require("express").Router()
const commentController = require("../../../controllers/admin/commentController")
const {asyncHandler} = require("../../../helpers/asyncHandler")

router.get("/", asyncHandler(commentController.getListComment))
router.post("/change-multi",asyncHandler(commentController.changeMulti))
router.post("/change-status/:id/:status", asyncHandler(commentController.changeStatus))
router.delete("/delete/:id", asyncHandler(commentController.deleteComment))

module.exports = router