const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../utils/token");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async(req,res)=>{
    const {
        name,
        email,
        password,
        profilePic
    }=req.body

    if(!email || !name || !password){
        throw new Error("All fields are required")
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    if (password.length < 8) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Passwords must be at least 8 characters",
        });
    }

    const salt =10
    const hashedpassword = await bcrypt.hash(password, salt)

    const existinguser = await User.findOne({email})
    if(existinguser){
        throw new Error("User already exists")
    }

    const newUser = await User.create({
        name,
        email,
        password:hashedpassword,
        profilePic
    })

    if(newUser){
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            profilePic: newUser.profilePic,
            token:generateToken(newUser._id)
        })
    }else{
        res.status(400)
        throw new Error("Failed to create user")
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error("User Not Found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(401);
        throw new Error("Invalid credentials");
    }

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        token: generateToken(user._id),
    });
});

const allusers=asyncHandler(async(req, res)=>{
    const keyword = req.query ?{
        $or:[
            {name:{ $regex: req.query.search, $options: "i"}},
            {email:{ $regex: req.query.search, $options: "i"}}
        ]
    }:{}

    const users= await User.find(keyword)
    res.send(users)
});

module.exports = {registerUser,loginUser,allusers}
