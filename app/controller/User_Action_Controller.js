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

    addFolder(req,res){

        this.system.addFolder(req,res);

    }

    uploadFile(req,res){
        this.system.uploadFile(req,res);
    }

    deleteFile(req,res){
        this.system.deleteFile(req,res);
    }
    deleteProject(req,res){

        this.system.deleteProject(req,res);
    }
    deleteFolder(req,res){
        this.system.deleteFolder(req,res);
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
    requestFolder(req,res){
        this.system.displayFolder(req,res);
    }
    requestAddFolder(req,res){

        this.system.displayAddFolder(req,res);

    }
    requestFile(req,res){

        this.system.displayFile(req,res);

    }
    requestUpload(req,res){

        this.system.displayUpload(req,res);

    }
    requestProject(req,res){
        this.system.displayProject(req,res);
    }
    requestCreateProjectForm(req,res){

        this.system.displayCreateProjectForm(req,res)
    }
    requestInviteUserForm(req,res){

        this.system.displayInviteUserForm(req,res);

    }

}
module.exports ={User_Action_Controller:User_Action_Controller};