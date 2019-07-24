class AuthResponse{
    constructor(display,command,request,response){
        this.display = display;
        this.admin = false;
        this.command = command;
        this.request = request;
        this.response = response;
        this.variables = {};

    }
}
module.exports={AuthResponse:AuthResponse};