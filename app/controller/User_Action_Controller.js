class User_Action_Controller{

    constructor(systemController){

        this.system = systemController;
    }

    /** User Actions **/

    signIn(req,res){

        this.system.signIn(req,res);

    }

    signOut(req,res){

        this.system.signOut(req,res);

    }

    inviteUser(req,res){

        this.system.inviteUser(req,res);
    }

    createProject(req,res){

        this.system.createProject(req,res);
    }

    /** View Requests **/

    requestUserDashboard(req,res){

       this.system.displayDashboard(req,res);

    }
    requestProjectsIndex(req,res){

        this.system.displayProjectsIndex(req,res);

    }
    requestCreateProjectForm(req,res){

        this.system.displayCreateProjectForm(req,res)
    }
    requestInviteUserForm(req,res){

        this.system.displayInviteUserForm(req,res);

    }

}
module.exports ={User_Action_Controller:User_Action_Controller};