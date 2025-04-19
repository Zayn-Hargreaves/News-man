const router = require("express").Router()
const sourceController = require("../../../controllers/admin/sourceController")
const { asyncHandler } = require('../../../helpers/asyncHandler')

// lay danh sach nguon
router.get("/", asyncHandler(sourceController.getListSource))
router.post("/create", asyncHandler(sourceController.addNewSource))
router.patch("/edit/:id", asyncHandler(sourceController.updateSource))
router.get("/detail/:id", asyncHandler(sourceController.getSourceDetail))
router.put("/change-status/:id/:status", asyncHandler(sourceController.changeStatus))
router.patch("/change-multi",asyncHandler(sourceController.changeMulti))
// xoa 1 nguon
router.delete("/delete/:id", asyncHandler(sourceController.deleteSource))


module.exports = router