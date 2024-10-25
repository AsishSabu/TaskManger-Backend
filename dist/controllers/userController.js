"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const httpTypes_1 = require("../types/httpTypes");
const authService_1 = __importDefault(require("../utils/authService"));
const taskModel_1 = require("../models/taskModel");
const customError_1 = __importDefault(require("../utils/customError"));
const otpModel_1 = __importDefault(require("../models/otpModel"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const authMails_1 = require("../utils/authMails");
function handleRegister(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        console.log(req.body);
        try {
            const existingUser = yield userModel_1.default.findOne({ email: user.email });
            if (existingUser) {
                res
                    .status(httpTypes_1.HttpStatus.BAD_REQUEST)
                    .json({ message: "email already existed" });
            }
            else {
                const hashedPassword = yield authService_1.default.encryptedPassword(user.password);
                console.log(hashedPassword, "hashed");
                const newUser = new userModel_1.default({
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    role: user.role,
                    manager: user.manager,
                });
                console.log(newUser, "newuser");
                yield newUser.save();
                const OTP = yield authService_1.default.generateOtp();
                const emailSubject = "Account verification";
                yield otpModel_1.default.create({ otp: OTP, userId: newUser._id });
                console.log(OTP, "otppppp");
                yield (0, sendMail_1.default)(newUser.email, emailSubject, (0, authMails_1.otpEmail)(OTP, newUser.name));
                res
                    .status(httpTypes_1.HttpStatus.CREATED)
                    .json({ message: "otp is sended to the mail", user: newUser });
            }
        }
        catch (error) {
            console.error(error);
            next(new customError_1.default("Server error during registration", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
function verifyOtp(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { otp, userId } = req.body;
        try {
            const OTP = yield otpModel_1.default.findOne({ userId });
            if (!OTP) {
                throw new customError_1.default("Invalid OTP", httpTypes_1.HttpStatus.BAD_REQUEST);
            }
            if (OTP.otp === otp) {
                yield userModel_1.default.findByIdAndUpdate(userId, { isVerified: true });
                yield otpModel_1.default.deleteOne({ userId });
                res
                    .status(httpTypes_1.HttpStatus.OK)
                    .json({ message: "User account is verified, please login" });
            }
            else {
                throw new customError_1.default("Invalid OTP, please try again", httpTypes_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (error) {
            next(error);
        }
    });
}
function handleLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            console.log(req.body);
            const isEmailExist = yield userModel_1.default.findOne({ email });
            console.log(isEmailExist);
            if (!isEmailExist) {
                throw new customError_1.default("Invalid Credentials", httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
            if (isEmailExist.isBlocked) {
                throw new customError_1.default("User is blocked", httpTypes_1.HttpStatus.FORBIDDEN);
            }
            if (!isEmailExist.isVerified) {
                throw new customError_1.default("please use verified mail id", httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
            const isPasswordMatched = yield authService_1.default.comparePassword(password, isEmailExist === null || isEmailExist === void 0 ? void 0 : isEmailExist.password);
            if (!isPasswordMatched) {
                throw new customError_1.default("Invalid Credentials", httpTypes_1.HttpStatus.UNAUTHORIZED);
            }
            const accessToken = yield authService_1.default.createTokens(isEmailExist.id, isEmailExist.name, isEmailExist.role);
            res.json({
                status: "success",
                message: "user logged in",
                accessToken,
                user: isEmailExist,
            });
        }
        catch (error) {
            console.error(error);
            next(error);
        }
    });
}
function getUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const user = yield userModel_1.default.find({ _id: id }).populate("manager");
            if (!user) {
                throw new customError_1.default("User not found", httpTypes_1.HttpStatus.NOT_FOUND);
            }
            res
                .status(httpTypes_1.HttpStatus.OK)
                .json({ message: "User fetched successfully", user });
        }
        catch (error) {
            console.error(error);
            next(new customError_1.default("Error fetching user", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
function getTasks(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        try {
            const tasks = yield taskModel_1.Task.find({ assignedTo: id });
            const user = yield userModel_1.default.find({ _id: id });
            if (!user) {
                throw new customError_1.default("User not found", httpTypes_1.HttpStatus.NOT_FOUND);
            }
            res
                .status(httpTypes_1.HttpStatus.OK)
                .json({ message: "Tasks fetched successfully", tasks, user });
        }
        catch (error) {
            console.error(error);
            next(new customError_1.default("Error fetching tasks", httpTypes_1.HttpStatus.INTERNAL_SERVER_ERROR));
        }
    });
}
exports.default = {
    handleRegister,
    handleLogin,
    getUser,
    getTasks,
    verifyOtp,
};
