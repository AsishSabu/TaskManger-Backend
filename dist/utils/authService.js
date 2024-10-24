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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configKeys_1 = __importDefault(require("../config/configKeys"));
const encryptedPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    password = yield bcryptjs_1.default.hash(password, salt);
    return password;
});
const comparePassword = (inputPassword, password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.compare(inputPassword, password);
});
const createTokens = (id, name, role) => {
    const payload = {
        id,
        name,
        role,
    };
    const accessToken = jsonwebtoken_1.default.sign(payload, configKeys_1.default.ACCESS_SECRET);
    return accessToken;
};
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return `${otp}`;
};
exports.default = {
    encryptedPassword,
    comparePassword,
    createTokens,
    generateOtp
};
