const express = require("express")
const clientRouter = express.Router()

clientRouter.use("/",require("./authRoutes"))

module.exports = clientRouter
