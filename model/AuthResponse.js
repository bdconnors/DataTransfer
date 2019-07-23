class AuthResponse{
    constructor(display,command,response){
        this.display = display;
        this.admin = false;
        this.command = command;
        this.response = response;
        this.variables = {};

    }
}
module.exports={AuthResponse:AuthResponse};