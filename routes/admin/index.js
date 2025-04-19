const express = require("express")
const {authentication} = require("../../auth/authUtils")
const adminRouter = express.Router()

adminRouter.use("/auth", require("./auth"))
adminRouter.use(authentication)
adminRouter.use("/account", require("./account"))
adminRouter.use("/article", require("./article"))
adminRouter.use("/category", require("./category"))
adminRouter.use("/comments", require("./comment"))
adminRouter.use("/role", require("./role"))
adminRouter.use("/source", require("./source"))
adminRouter.use("/stats", require("./stats"))
adminRouter.use("/permission", require("./permission"))

module.exports = adminRouter