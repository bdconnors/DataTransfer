class System_Authorization_Controller{

    constructor(sys,userControl,permissionControl){
        this.sys = sys;
        this.userControl = userControl;
        this.permissionControl = permissionControl;
    }


    /** Authorize POST actions **/
    verifyCredentials(req,res){

        let email = req.body.email;
        let password = req.body.password;
        let user = this.userControl.checkAccountCredentials(email,password);
        console.log(user);
        if(user){
            req.session.user = user;
            this.sys.setUser(user);
            this.sys.setSystemUsers(this.userControl.getAllUsers());
            this.sys.loadAuthorizedProjects();
            this.sys.loadAuthorizedEntities();

            this.sys.redirectToDashboard(req, res);

        }else{
            this.sys.serveLoginFail(req,res);
        }

    }
    invite(req,res){

        if(this.verifyAdmin(req,res)){
            this.sys.inviteUser()
        }

    }

    logOut(req,res){
        this.destroySession(req);
        this.sys.redirectToLogin(req,res);
    }

    /** Authorize GET actions **/
    inviteForm(req,res){
        if(this.verifyAdmin(req,res)){
            this.sys.serveInviteForm(req,res);
        }
    }
    dashboard(req,res){
        this.sys.serveDashboard(req,res);
    }

    /** User Authorization Methods **/
    verifySessionIntegrity(req,res){


        if(req.session && req.session.user){

            if(req.session.user.id === this.sys.getUser().id){
                return true;
            }else{
                this.destroySession(req);
                this.sys.redirectToLogin(req,res);
            }

        }else{
            this.sys.redirectToLogin(req,res);
        }
    }

    verifyAdmin(req,res){
        if(this.verifySessionIntegrity(req,res)){

            if(this.sys.getUser().admin){
                return true;
            }else{
                this.sys.redirectToUnAuthorized(req,res);
            }
        }
    }

    /** Session Methods **/
    destroySession(req){
        req.session.destroy();
    }

}
module.exports = {System_Authorization_Controller:System_Authorization_Controller};