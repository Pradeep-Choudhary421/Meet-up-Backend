const User = require("../Models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const createUser = async (req, res) => {
  const data = req.body;
  const newUser = new User(data);
  try {
    const email = await User.findOne({ email: req.body.email });
    if (email) {
      return res.status(400).json({ message: "Account already exists" });
    }
    const hashedpass = await bcrypt.hash(data.password, 10);
    newUser.password = hashedpass;
    await newUser.save();
    return res.status(200).json({
      message: "Account created successfully",
      data: newUser,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Email does not exist" });
    }
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {expiresIn: "24h"});
    return res
      .status(200).cookie("token",token)
      .json({
        message: "Login successful",
        token: token,
        success: true,
        data: user,
      });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

const getOtherUser = async(req,res) =>{
    try{
        const otherUser = await User.find({_id : { $ne : req.user._id }})
        return res.status(200).json({message : "User found", data : otherUser,
            success : true})
    } catch(err){
        res.status(500).json({message:err.message,success:false})
    }
}
module.exports = {createUser, login, getOtherUser}    