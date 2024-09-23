const { registerUser, loginUser, allusers } = require('../Controller/userController')
const { protect } = require('../Middleware/authMiddleware')

const router = require('express').Router()

router.route('/').post(registerUser).get(protect,allusers)
router.route('/login').post(loginUser)

module.exports = router