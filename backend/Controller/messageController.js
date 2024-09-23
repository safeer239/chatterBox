const asyncHandler = require("express-async-handler");
const Message=require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModels");

const sendMessage =asyncHandler(async(req,res)=>{
    const {content,chatId}=req.body

    if(!chatId || !content){
        console.log("Inavalid data passed to server")
        return res.sendStatus(400) 
    }

    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId,
    }

    try {
        let message =await Message.create(newMessage)
        message=await message.populate("sender", "name profilePic")
        message=await message.populate("chat")
        message=await User.populate(message,{
            path:"chat.users",
            select:"name profilePic email",
        })

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message,
        })

        res.json(message)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
});

const allMessage =asyncHandler(async(req,res)=>{
    const {chatId}=req.params
    try {
        const messages= await Message.find({chat:chatId})
        .populate("sender", "name profilePic email")
        .populate("chat");
        // console.log(messages)
        // console.log(chatId)

        // if (!messages.length) {
        //     return res.status(404).json({ message: "No messages found for this chat" });
        // }

         res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports ={sendMessage,allMessage}