const { sendMessage, allMessage } = require('../Controller/messageController')
const { protect } = require('../Middleware/authMiddleware')

const router = require('express').Router()


router.route("/").post(protect,sendMessage)
router.route("/:chatId").get(protect,allMessage)

module.exports = router