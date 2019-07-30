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
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async postAddProjectPermission(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
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
    async postRenameProject(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async postRenameFolder(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async postCreateProject(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async getUser(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        authResponse.command = 'ACTION';
        this.notifyAll(authResponse);
    }
    async getAllUsers(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        if(authResponse.admin){
            authResponse.command = 'ACTION';
        }
        this.notifyAll(authResponse);
    }
    async getProjectUsers(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        if(authResponse.admin){
            authResponse.command = 'ACTION';
        }
        this.notifyAll(authResponse);
    }
    async getProjectPage(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.sessionAuth(authResponse,req);
        authResponse = await this.projectAuth(authResponse,req);
        console.log('back in project auth page before notify');
        this.notifyAll(authResponse);
    }
    async getFolderPage(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.sessionAuth(authResponse,req);
        authResponse = await this.folderAuth(authResponse,req);
        this.notifyAll(authResponse);
    }
    async postNewFolder(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async postAddFolderPermission(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async getFolderUsers(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        if(authResponse.admin) {
            authResponse.command = 'ACTION';
        }
        this.notifyAll(authResponse)
    }
    async postRemoveFolderPermission(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async postDeleteFolder(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async postDeleteProject(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async postDeleteFile(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async postUploadFile(req,res){
        let authResponse = this.make(req,res);
        console.log('inside post upload file');
        console.log(req.body.folderId);
        console.log(req.body.projectId);
        authResponse = await this.sessionAuth(authResponse,req);
        authResponse = await this.uploadAuth(authResponse,req);
        this.notifyAll(authResponse);

    }
    async getUserProfile(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        if(authResponse.admin){
            let userProfile = await this.userControl.getUser('id',req.params.id);
            console.log('this is the profile user');
            console.log(userProfile);
            console.log('auth control');
            console.log(req.params.id);
            console.log(req.session.user.id);
            authResponse.variables.user = userProfile;
            authResponse.display ='/users/userProfile';
        }
        this.notifyAll(authResponse);
    }
    async getViewFile(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.sessionAuth(authResponse,req);
        authResponse = await this.fileAuth(authResponse,req,'view');
        authResponse.variables.storage = {};
        authResponse.variables.storage.disposition = 'inline';
        this.notifyAll(authResponse);
    }
    async getDownloadFile(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.sessionAuth(authResponse,req);
        authResponse = await this.fileAuth(authResponse,req,'download');
        authResponse.variables.storage = {};
        authResponse.variables.storage.disposition = 'attachment';
        this.notifyAll(authResponse);
    }
    async fileAuth(authResponse,req,disposition){
        let user = req.session.user;
        let folderId = req.params.folderid;
        let projectId = req.params.id;
        let authorized = false;
        if(user.admin){
            authorized = true;
        }else {
            let permission = await this.userControl.getProjectPermission(user.id, projectId);
            permission.folderPermissions.forEach(perm => {
                if (perm.folderId === folderId) {
                    if (perm[disposition]) {
                        authorized = true;
                    }
                }
            });
        }
        if(!authorized){
            authResponse.display = '/unauthorized';
        }else{
            authResponse.display = '/projects/project/:id/folders/folder/:folderid/file/:filename';
            authResponse.command = 'ACTION';
        }
        return authResponse;

    }
    async uploadAuth(authResponse,req){
        let user = req.session.user;
        let folderId = req.body.folderId;
        let projectId = req.body.projectId;
        console.log('inside upload auth');
        console.log(folderId);
        console.log(projectId);
        let folder = await this.projectControl.getFolder(projectId,folderId);
        if(user.admin || folder.metadata.userFolder === user.id){
            authResponse.variables.folder = folder;
        }else{
            authResponse.display = '/unauthorized';
        }
        return authResponse;

    }
    async folderAuth(authResponse,req){

        let user = req.session.user;
        let authorized = false;
        let projectId = req.params.id;
        let folderId = req.params.folderid;
        if(user.admin){
            authorized = true;
        }else{
            let projectPermission = await this.userControl.getProjectPermission(user.id,projectId);
            projectPermission.folderPermissions.forEach(perm=>{
                if(perm.folderId === folderId){
                    authorized = true;
                    authResponse.variables.permission = perm;
                }
            });

        }
        if(authorized){
            authResponse.variables.folder = await this.projectControl.getFolder(projectId,folderId);
            authResponse.display = "/projects/folders/folder";
        }
        else{
            authResponse.display ='/unauthorized';
        }
        return authResponse
    }
    async projectAuth(authResponse,req){
        let projectId = req.params.id;
        let authorized = false;
        if(req.session.user.admin){
            authResponse.variables.project = await this.projectControl.getProject(projectId);
            authResponse.display = '/projects/project';
            authorized = true;
        }else{
            let permission = await this.userControl.getProjectPermission(req.session.user.id,projectId);
            authResponse.variables.project = permission;
            if(permission){
                authResponse.display = '/projects/project';
                authorized = true;
            }
        }
        if(!authorized){
            authResponse.display = '/unauthorized';
        }
        return authResponse;
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
                    this.notifyAll(authResponse);
                }
            }else{
                authResponse = this.badSession(authResponse);
                this.notifyAll(authResponse);
            }
        }else{
            authResponse = this.badSession(authResponse);
            this.notifyAll(authResponse);
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