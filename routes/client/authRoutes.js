const router = require('express').Router()
const { authentication } = require('../../auth/authUtils')
const authController = require('../../controllers/admin/authControllers')
const { asyncHandler } = require('../../helpers/asyncHandler')


router.post('/login', asyncHandler(authController.login))
// router.use(authentication)
router.post('/logout', asyncHandler(authController.logout))
router.post('/handleRefreshToken', asyncHandler(authController.handleRefreshToken))
// router.post('/api/news/writer/add',middleware.auth,middleware.role, authController.add_writer)

// router.get('/api/news/writers',middleware.auth,middleware.role, authController.get_writers)

module.exports = router