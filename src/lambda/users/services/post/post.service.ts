import {APIGatewayProxyEvent} from "aws-lambda";
export class UsersPostService{
    
    constructor(private event:APIGatewayProxyEvent){}

     generateOTP():any{
        return {"msg":"This is otp function:","event":this.event};
    }

}