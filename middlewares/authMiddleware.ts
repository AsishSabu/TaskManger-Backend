import jwt, { JwtPayload } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"

import { HttpStatus } from "../types/httpTypes"
import configKeys from "../config/configKeys"

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export default function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const access_token = req.headers.authorization
  try {
    if (!access_token) {
      res.status(HttpStatus.FORBIDDEN).json("Your are not authenticated")
    } else {
      const tokenParts = access_token.split(" ")
      const token = tokenParts.length === 2 ? tokenParts[1] : null
      if (!token) {
        res.status(HttpStatus.FORBIDDEN).json("Invalid access token format")
      } else {
        jwt.verify(token, configKeys.ACCESS_SECRET, (err: any, user: any) => {
          if (err) {
            res
              .status(HttpStatus.FORBIDDEN)
              .json({ success: false, message: "Token is not valid" })
          } else if (user.isBlocked) {
            res
              .status(HttpStatus.FORBIDDEN)
              .json({ success: false, message: "user is Blocked" })
          } else {
            req.user = user.id
            next()
          }
        })
      }
    }
  } catch (error) {
    next(error)
  }


}
