class User_Action_Controller{

    constructor(sysAuth){
        this.sysAuth = sysAuth;
    }

    /** POST actions **/
    logIn(req,res){
        this.sysAuth.verifyCredentials(req,res);
    }
    logOut(req,res){
        this.sysAuth.logOut(req,res);
    }
    inviteUser(req,res){
        this.sysAuth.invite(req,res);
    }

    /** GET actions **/
    requestUserDashboard(req,res){
        this.sysAuth.dashboard(req,res);
    }
    requestInviteForm(req,res) {
        this.sysAuth.inviteForm(req, res);
    }



}
module.exports={User_Action_Controller:User_Action_Controller};