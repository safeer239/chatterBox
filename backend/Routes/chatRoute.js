const { accessChat, getChat, createGroupChat, renameGroupChat, addToGroupChat, removeFromGroupChat } = require('../Controller/chatController')
const { protect } = require('../Middleware/authMiddleware')

const router = require('express').Router()

router.route("/",).post(protect,accessChat)
router.route("/",).get(protect,getChat)
router.route("/groupChat",).post(protect,createGroupChat)
router.route("/rename",).put(protect,renameGroupChat)
router.route("/groupAdd",).put(protect,addToGroupChat)
router.route("/groupRemove",).put(protect,removeFromGroupChat)

module.exports = router