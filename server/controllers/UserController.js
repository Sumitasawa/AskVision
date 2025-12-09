import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


//REGISTER USER — SAFE, VALIDATED, PASSWORD HASHED
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // 👇 THIS FIXES THE ERROR
    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user._id);

    return res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};




//LOGIN USER — SAFE PASSWORD CHECK + TOKEN RESPONSE


export const LoginUser = async (req, res) => {
  console.log("Login Hit")
  try {
    const { email, password } = req.body; 
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    // Include password field for login
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    return res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};




//GET USER DETAILS — RETURNS LOGGED-IN USER
export const getUser = async (req, res) => {
  try {
    const user = req.user; // from protect middleware

    return res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits
      }
    });

  } catch (error) {
    console.error("GetUser Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


//API to get publiseh images

export const getPublishedImages=async(req,res)=>{

  try{
    const publishedImages=await Chat.aggregate([
      {
        $unwind:"$messages"
      },
      {
        $match:{
          "messages.isImage":true,
            "messages.isPublished":true,
        }
      },{
        $project:{
          _id:0,
          imageUrl:"$messages.content",
          userName:"$userName"
        }
      }
    ])

    res.json({success:true,images:publishedImages.reverse()})
  }catch(error){
    res.json({success:false,message:error.message})
  }
}