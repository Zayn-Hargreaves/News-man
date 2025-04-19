const router = require("express").Router()
const accountController = require("../../../controllers/admin/accountController")
const {asyncHandler} = require("../../../helpers/asyncHandler")
router.get("/", asyncHandler(accountController.getListAccount))
router.get("/detail/:id", asyncHandler(accountController.getAccountDetail))
router.patch("/change-password", asyncHandler(accountController.changePassword))
router.put('/change-status/:id/:status', asyncHandler(accountController.changeStatus))
router.put("/change-multi", asyncHandler(accountController.changeMulti))
router.post('/create', asyncHandler(accountController.createAccount))
router.delete("/delete/:id", asyncHandler(accountController.deleteAccount))

module.exports = router