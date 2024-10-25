import { NextFunction, Request, Response } from "express"
import User from "../models/userModel"
import { HttpStatus } from "../types/httpTypes"
import IUser from "../types/userTypes"
import authService from "../utils/authService"
import { Task } from "../models/taskModel"
import customError from "../utils/customError"
import otpModel from "../models/otpModel"
import sendMail from "../utils/sendMail"
import { otpEmail } from "../utils/authMails"

async function handleRegister(req: Request, res: Response, next: NextFunction) {
  const user: IUser = req.body
  console.log(req.body)

  try {
    const existingUser = await User.findOne({ email: user.email })
    if (existingUser) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "email already existed" })
    } else {
      const hashedPassword = await authService.encryptedPassword(user.password)
      console.log(hashedPassword, "hashed")

      const newUser = new User({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        manager: user.manager,
      })
      console.log(newUser, "newuser")

      await newUser.save()

      const OTP = await authService.generateOtp()
      const emailSubject = "Account verification"
      await otpModel.create({ otp: OTP, userId: newUser._id })
      console.log(OTP, "otppppp")
      await sendMail(newUser.email, emailSubject, otpEmail(OTP, newUser.name))

      res
        .status(HttpStatus.CREATED)
        .json({ message: "otp is sended to the mail", user: newUser })
    }
  } catch (error) {
    console.error(error)
    next(
      new customError(
        "Server error during registration",
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    )
  }
}

async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  const { otp, userId } = req.body

  try {
    const OTP = await otpModel.findOne({ userId })
    if (!OTP) {
      throw new customError("Invalid OTP", HttpStatus.BAD_REQUEST)
    }
    if (OTP.otp === otp) {
      await User.findByIdAndUpdate(userId, { isVerified: true })
      await otpModel.deleteOne({ userId })
      res
        .status(HttpStatus.OK)
        .json({ message: "User account is verified, please login" })
    } else {
      throw new customError(
        "Invalid OTP, please try again",
        HttpStatus.BAD_REQUEST
      )
    }
  } catch (error) {
    next(error)
  }
}
async function handleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body
    console.log(req.body)

    const isEmailExist = await User.findOne({ email })
    console.log(isEmailExist)

    if (!isEmailExist) {
      throw new customError("Invalid Credentials", HttpStatus.UNAUTHORIZED)
    }
    if (isEmailExist.isBlocked) {
      throw new customError("User is blocked", HttpStatus.FORBIDDEN)
    }
    if (!isEmailExist.isVerified) {
      throw new customError("please use verified mail id", HttpStatus.UNAUTHORIZED)
    }

    const isPasswordMatched = await authService.comparePassword(
      password,
      isEmailExist?.password
    )

    if (!isPasswordMatched) {
      throw new customError("Invalid Credentials", HttpStatus.UNAUTHORIZED)
    }

    const accessToken = await authService.createTokens(
      isEmailExist.id,
      isEmailExist.name as string,
      isEmailExist.role
    )

    res.json({
      status: "success",
      message: "user logged in",
      accessToken,
      user: isEmailExist,
    })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

async function getUser(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id
  try {
    const user = await User.find({ _id: id }).populate("manager")
    if (!user) {
      throw new customError("User not found", HttpStatus.NOT_FOUND)
    }
    res
      .status(HttpStatus.OK)
      .json({ message: "User fetched successfully", user })
  } catch (error) {
    console.error(error)
    next(
      new customError("Error fetching user", HttpStatus.INTERNAL_SERVER_ERROR)
    )
  }
}

async function getTasks(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id
  try {
    const tasks = await Task.find({ assignedTo: id })
    const user = await User.find({ _id: id })
    if (!user) {
      throw new customError("User not found", HttpStatus.NOT_FOUND)
    }
    res
      .status(HttpStatus.OK)
      .json({ message: "Tasks fetched successfully", tasks, user })
  } catch (error) {
    console.error(error)
    next(
      new customError("Error fetching tasks", HttpStatus.INTERNAL_SERVER_ERROR)
    )
  }
}

export default {
  handleRegister,
  handleLogin,
  getUser,
  getTasks,
  verifyOtp,
}
