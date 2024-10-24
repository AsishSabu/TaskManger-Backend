import express from "express"
import userController from "../controllers/userController";
const employeRoute = express.Router();

employeRoute.post("/register",userController.handleRegister)
employeRoute.post("/login",userController.handleLogin)
employeRoute.post("/verifyOtp",userController.verifyOtp)
employeRoute.get("/profile/:id",userController.getUser)
employeRoute.get("/getTasks/:id",userController.getTasks)
export default employeRoute