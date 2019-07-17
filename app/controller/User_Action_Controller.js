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


    /** User Project Actions **/

    createProject(req,res){

        this.system.createProject(req,res);

    }

    viewProject(req,res){

        this.system.displayProject(req,res);

    }

    updateProjectPermissions(req,res){

        this.system.updateProjectPermissions(req,res);

    }

    deleteProject(req,res){

        this.system.deleteProject(req,res);
    }

    renameProject(req,res){

        this.system.renameProject(req,res);

    }

    uploadToProject(req,res){

        this.system.uploadFileToProject(req,res);

    }

    /** User Folder Actions **/

    addFolder(req,res){

        this.system.addFolder(req,res);

    }

    viewFolder(req,res){

        this.system.displayFolder(req,res);

    }

    renameFolder(req,res){

        this.system.renameFolder(req,res);

    }

    deleteFolder(req,res){

        this.system.deleteFolder(req,res);

    }
    uploadToFolder(req,res){
        this.system.uploadFileToFolder(req,res)
    }


    /** User File Actions **/

    viewFile(req,res){

        this.system.displayFile(req,res);

    }

    downloadFile(req,res){

        this.system.downloadFile(req,res);

    }

    deleteFile(req,res){

        this.system.deleteFile(req,res);

    }

    renameFile(req,res){

        this.system.renameFile(req,res);

    }



    /** View Requests **/

    userDashboard(req,res){

       this.system.displayDashboard(req,res);

    }

    projectPermissionsForm(req,res){

        this.system.displayProjectPermissions(req,res);

    }

    projectsIndex(req,res){

        this.system.displayProjectsIndex(req,res);

    }

    addFolderForm(req,res){

        this.system.displayAddFolder(req,res);

    }

    folderUploadForm(req,res){
        this.system.displayFolderUploadForm(req,res);
    }

    projectUploadForm(req,res){

        this.system.displayProjectUploadForm(req,res);

    }

    fileRenameForm(req,res){

        this.system.displayFileRenameForm(req,res);
    }

    folderRenameForm(req,res){

        this.system.displayFolderRenameForm(req,res);

    }

    createProjectForm(req,res){

        this.system.displayCreateProjectForm(req,res)

    }
    projectRenameForm(req,res){

        this.system.displayProjectRenameForm(req,res);

    }

    inviteUserForm(req,res){

        this.system.displayInviteUserForm(req,res);

    }

}
module.exports ={User_Action_Controller:User_Action_Controller};