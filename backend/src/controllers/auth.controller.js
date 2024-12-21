import cloudinary from "../lib/cloudinary.js"
import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signUp = async (req, res) => {
  const { fullName, email, password } = req.body
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "password must be at least 6 characters" })
    }

    const user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "user already exist" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      email,
      password: hashPassword
    })

    if (newUser) {
      generateToken(newUser._id, res)
      await newUser.save()
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        message: "user created successfully"
      })
    } else {

      res.status(400).json({ message: "Invalid User Data" })
    }

  } catch (error) {
    console.log("Error in sign up controller", error.message);
    res.status(500).json({ message: error.message })
  }
}



export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" })
    }

    generateToken(user._id, res)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      message: "user logged in successfully"
    })

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "internal server error" })
  }
}


export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0
    })
    res.status(200).json({ message: "logged out successfully" })
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "internal server error" })

  }
}


export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body
    const userId = req.user._id
    if (!profilePic) {
      return res.status(400).json({ message: "profile pic is required" })
    }

    const uploadResponce = await cloudinary.uploader.upload(profilePic)

    const uploadUser = await User.findByIdAndUpdate(userId, {
      profilePic: uploadResponce.secure_url
    }, { new: true })

    res.status(200).json(uploadUser)

  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({ message: "internal server error" })
  }
}

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "internal server error" })

  }
}