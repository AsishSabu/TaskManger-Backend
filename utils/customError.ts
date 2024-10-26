import { HttpStatus } from "../types/httpTypes";


class customError extends Error{
    statusCode:number;
    status:string;
    isOperational:boolean;
    constructor(message:string,statusCode:HttpStatus){
        super(message);
        this.statusCode=statusCode;
        this.status=`${statusCode}`.startsWith('4')?'fail':'error';
        this.isOperational=true;
        Error.captureStackTrace(this,this.constructor);
    }
}

export default customError;