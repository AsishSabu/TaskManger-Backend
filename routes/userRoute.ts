import express from "express"
import userController from "../controllers/userController"
import authenticateUser from "./../middlewares/authMiddleware"
const employeRoute = express.Router()

employeRoute.post("/register", userController.handleRegister)
employeRoute.post("/login", userController.handleLogin)
employeRoute.post("/verifyOtp", userController.verifyOtp)
employeRoute.post("/resendOtp/:id", userController.resendOtp)
employeRoute.get("/profile/:id", authenticateUser, userController.getUser)
employeRoute.get("/getTasks/:id", authenticateUser, userController.getTasks)

export default employeRoute
