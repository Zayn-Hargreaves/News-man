const router = require('express').Router()
const { authentication } = require('../../../auth/authUtils')
const authController = require('../../../controllers/admin/authControllers')
const { asyncHandler } = require('../../../helpers/asyncHandler')

router.post('/login', asyncHandler(authController.login))
router.use(authentication)
router.post('/logout', asyncHandler(authController.logout))
router.post('/handleRefreshToken', asyncHandler(authController.handleRefreshToken))

module.exports = router