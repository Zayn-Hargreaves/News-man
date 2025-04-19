const router = require("express").Router()
const userController = require("../../../controllers/admin/userController")
const {asyncHandler} = require("../../../helpers")
router.get("/", asyncHandler(userController.getListUser))
router.get("/detail/:id", asyncHandler(userController.getUserDetail))
router.put("/change-status/:id/:status", asyncHandler(userController.changeStatus))
router.put("change-multi", asyncHandler(userController.changeMulti))

module.exports=router