import bcrypt, { compare } from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import configKeys from "../config/configKeys";

const encryptedPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    return password;
  };

  const comparePassword = async (inputPassword: string, password: string) => {
    return await bcrypt.compare(inputPassword, password);
  };

  const createTokens = (id: string, name: string, role: string) => {
    const payload = {
      id,
      name,
      role,
    };
    const accessToken = jwt.sign(payload, configKeys.ACCESS_SECRET);
    return accessToken;
  };
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return `${otp}`;
  };


  export default{
    encryptedPassword,
    comparePassword,
    createTokens,
    generateOtp
  }