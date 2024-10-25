"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authenticateUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const httpTypes_1 = require("../types/httpTypes");
const configKeys_1 = __importDefault(require("../config/configKeys"));
function authenticateUser(req, res, next) {
    const access_token = req.headers.authorization;
    try {
        if (!access_token) {
            res.status(httpTypes_1.HttpStatus.FORBIDDEN).json("Your are not authenticated");
        }
        else {
            const tokenParts = access_token.split(" ");
            const token = tokenParts.length === 2 ? tokenParts[1] : null;
            if (!token) {
                res.status(httpTypes_1.HttpStatus.FORBIDDEN).json("Invalid access token format");
            }
            else {
                jsonwebtoken_1.default.verify(token, configKeys_1.default.ACCESS_SECRET, (err, user) => {
                    if (err) {
                        res
                            .status(httpTypes_1.HttpStatus.FORBIDDEN)
                            .json({ success: false, message: "Token is not valid" });
                    }
                    else if (user.isBlocked) {
                        res
                            .status(httpTypes_1.HttpStatus.FORBIDDEN)
                            .json({ success: false, message: "user is Blocked" });
                    }
                    else {
                        req.user = user.id;
                        next();
                    }
                });
            }
        }
    }
    catch (error) {
        next(error);
    }
}
