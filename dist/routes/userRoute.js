"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleware_1 = __importDefault(require("./../middlewares/authMiddleware"));
const employeRoute = express_1.default.Router();
employeRoute.post("/register", userController_1.default.handleRegister);
employeRoute.post("/login", userController_1.default.handleLogin);
employeRoute.post("/verifyOtp", userController_1.default.verifyOtp);
employeRoute.post("/resendOtp/:id", userController_1.default.resendOtp);
employeRoute.get("/profile/:id", authMiddleware_1.default, userController_1.default.getUser);
employeRoute.get("/getTasks/:id", authMiddleware_1.default, userController_1.default.getTasks);
exports.default = employeRoute;
