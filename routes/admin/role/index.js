const router = require("express").Router()
const roleController = require("../../../controllers/admin/roleController")
const {asyncHandler} = require("../../../helpers/asyncHandler")
router.get("/", asyncHandler(roleController.getListRole))
router.delete("/delete/:id", asyncHandler(roleController.deleteRoel))
router.patch("/edit/:id", asyncHandler(roleController.editRole))
router.post("/create", asyncHandler(roleController.createRole))
router.get("/detail/:id", asyncHandler(roleController.getRoleDetail))

module.exports = router