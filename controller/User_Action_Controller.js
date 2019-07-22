class User_Action_Controller{

    constructor(sys){
        this.sys = sys;
    }

    /** POST actions **/
    logIn(req,res){
        this.sys.postLogIn(req,res);
    }
    logOut(req,res){
        this.sys.postLogOut(req,res);
    }
    inviteUser(req,res){
        this.sys.postInvite(req,res);
    }
    createProject(req,res){
        this.sys.postCreatProject(req,res);
    }
    submitNewAccount(req,res){
        this.sys.postNewUserAuth(req,res);
    }

    /** GET actions **/
    requestLogin(req,res){
        this.sys.getLogin(req,res);
    }
    requestDashboard(req,res){
        this.sys.getDashboard(req,res);
    }
    requestUserProfile(req,res){
        this.sys.getUserProfile(req,res);
    }
    requestInviteForm(req,res){
        this.sys.getInviteForm(req,res);
    }
    requestNewUserAuth(req,res){
        this.sys.getNewUserAuth(req,res);
    }
    requestCreateProjectForm(req,res){
        this.sys.getCreateProject(req,res);
    }
    requestProject(req,res){
        this.sys.getProject(req,res);
    }

}
module.exports={User_Action_Controller:User_Action_Controller};