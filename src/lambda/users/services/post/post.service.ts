import {ApiGatewayProxyEvent} from "aws-lambda";
export class UsersPostService{
    
    constructor(private event:ApiGatewayProxyEvent){}

     generateOTP():any{
        return {"msg":"This is otp function:","event":this.event};
    }

}