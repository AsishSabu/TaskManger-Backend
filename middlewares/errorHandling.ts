import {Request,Response,NextFunction} from "express";
import customError from "../utils/customError";

const errorHandlingMiddleware=(
    err:customError,
    req:Request,
    res:Response,
    next:NextFunction
)=>{  
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (err.statusCode === 404) {
    res
      .status(err.statusCode)
      .json({ errors: err.status, errorMessage: err.message });
  } else {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }    
}

export default errorHandlingMiddleware