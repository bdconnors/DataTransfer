const AuthResponse= require('../model/AuthResponse').AuthResponse;

class SystemAuthController{

    constructor(userControl,projectControl){
        this.userControl = userControl;
        this.projectControl = projectControl;
        this.observers=[];
    }

    getLogin(req,res){
        let authResponse = this.make(req,res);
        this.notifyAll(authResponse);
    }
    async postLogin(req,res){
        let authResponse = this.make(req,res);
        let verified = await this.userControl.verifyCredentials(req.body.email,req.body.password).catch((err)=>{throw err});
        if(verified){
            req.session.user = verified;
            authResponse.command = 'REDIRECT';
            authResponse.display = '/dashboard';
            authResponse.variables.user = req.session.user;
        }else{
            authResponse.display = '/loginFail';
            authResponse.command='DISPLAY';
            authResponse.variables.email = req.body.email;
            authResponse.variables.password = req.body.password;
        }
        this.notifyAll(authResponse);
    }
     getLogout(req,res){
        let authResponse = this.make(req,res);
        req.session.destroy();
        authResponse.command = 'REDIRECT';
        authResponse.display='/login';
        this.notifyAll(authResponse,);
    }
    getUnauthorized(req,res){
        let authResponse = this.make(req,res);
        this.notifyAll(authResponse);
    }
    async getDashboard(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.sessionAuth(authResponse,req).catch((err)=>{throw err});
        this.notifyAll(authResponse);
    }
    async getInvite(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async postInvite(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async postRemoveProjectPermission(req,res){
        console.log('hit auth');
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        console.log(authResponse.display);
        console.log(authResponse.command);
        this.notifyAll(authResponse);
    }
    async getAuthForm(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAuthCode(authResponse);
        this.notifyAll(authResponse);
    };
    async postAuthForm(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAuthCode(authResponse);
        this.notifyAll(authResponse);
    }
    async postCreateProject(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async getAllUsers(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        authResponse.command = 'ACTION';
        this.notifyAll(authResponse);
    }
    async getProjectUsers(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        authResponse.command = 'ACTION';
        this.notifyAll(authResponse);
    }

    async sessionAuth(authResponse,req){
        if(req.session && req.session.user){
            let dbUser = await this.userControl.getUser('id',req.session.user.id).catch((err)=>{throw err});
            if(dbUser) {
                if (req.session.user.id === dbUser.id) {
                    req.session.user = dbUser;
                    authResponse.variables.user = req.session.user;
                    if(req.session.user.admin){
                        authResponse.admin = true;
                        authResponse.variables.users = await this.userControl.getAllUsers();
                        authResponse.variables.projects = await this.projectControl.getAllProjects();
                    }
                } else {
                    req.session.destroy();
                    authResponse = this.badSession(authResponse);
                }
            }else{
                authResponse = this.badSession(authResponse);
            }
        }else{
            authResponse = this.badSession(authResponse);
        }
        return authResponse;
    }
    async checkAdmin(authResponse,req){
        authResponse = await this.sessionAuth(authResponse,req);
        if(authResponse.admin){
            return authResponse;
        }else{
            authResponse.command = '/redirect';
            authResponse.display = '/unauthorized';
        }
    }
    async checkAuthCode(authResponse) {
        let authCode = authResponse.request.query.authCode;
        let user = await this.userControl.getUser('authCode', authCode);
        if (!user) {
           authResponse.display ='/error/authUserNotFound';
           authResponse.command = 'REDIRECT';
        }else{
            authResponse.variables.user = user;
        }
        return authResponse;
    }
    make(req,res){

        let display = req.route.path;
        let command = this.getCommandType(req);
        return new AuthResponse(display,command,req,res);
    }
    getCommandType(req){
        let command;
        if(req.route.methods.get){
            command = 'DISPLAY';
        }else if(req.route.methods.post){
            command = 'ACTION';
        }
        return command;
    }
    badSession(authResponse){
        authResponse.command = 'REDIRECT';
        authResponse.display = '/login';
        return authResponse;
    }

    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(authResponse){

        this.observers.map(observer => observer.notify(authResponse));

    }

}
module.exports={SystemAuthController:SystemAuthController};