const AuthResponse= require('../model/AuthResponse').AuthResponse;

class SystemAuthController{

    constructor(userControl,projectControl){
        this.userControl = userControl;
        this.projectControl = projectControl;
        this.observers=[];
    }

    displayLogin(req,res){
        let authResponse = this.make(req,res);
        this.notifyAll(authResponse);
    }
    displayUnauthorized(req,res){
        let authResponse = this.make(req,res);
        this.notifyAll(authResponse);
    }
    logout(req,res){
        let authResponse = this.make(req,res);
        req.session.destroy();
        authResponse.command = 'REDIRECT';
        authResponse.display='/login';
        this.notifyAll(authResponse,);
    }
    async authorizeLogin(req,res){
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
    async authorizeSession(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.sessionAuth(authResponse,req);
        if(authResponse.session) {
            this.notifyAll(authResponse);
        }
    }
    async authorizeAdmin(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        this.notifyAll(authResponse);
    }
    async authorizeNewUser(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAuthCode(authResponse);
        this.notifyAll(authResponse);
    }
    async authorizeFolderView(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.sessionAuth(authResponse,req);
        if(authResponse.session) {
            authResponse = await this.folderAuth(authResponse, req);
            this.notifyAll(authResponse);
        }
    }
    async authorizeProjectView(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.sessionAuth(authResponse,req);
        if(authResponse.session) {
            authResponse = await this.projectAuth(authResponse, req);
            this.notifyAll(authResponse);
        }
    }
    async authorizeUpload(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.sessionAuth(authResponse,req);
        if(authResponse.session) {
            authResponse = await this.uploadAuth(authResponse, req);
        }
        this.notifyAll(authResponse);
    }
    async authorizeFileView(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.sessionAuth(authResponse,req);
        if(authResponse.session) {
            authResponse = await this.fileAuth(authResponse, req, 'view');
            authResponse.variables.storage = {};
            authResponse.variables.storage.disposition = 'inline';
            this.notifyAll(authResponse);
        }
    }
    async authorizeFileDownload(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.sessionAuth(authResponse,req);
        if(authResponse.session) {
            authResponse = await this.fileAuth(authResponse, req, 'download');
            authResponse.variables.storage = {};
            authResponse.variables.storage.disposition = 'attachment';
            this.notifyAll(authResponse);
        }
    }
    async authorizeProfileView(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        if(authResponse.admin){
            authResponse.variables.user = await this.userControl.getUser('id',req.params.id);
            authResponse.display ='/users/userProfile';
        }
        this.notifyAll(authResponse);
    }
    async authorizeDeleteAccount(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        if(authResponse.admin){
            this.userControl.deleteUser(req.params.id).then(()=>{
                authResponse.command = 'REDIRECT';
                authResponse.display = '/dashboard';
                this.notifyAll(authResponse);
            }).catch(err=>{throw err});
        }else{
            this.notifyAll(authResponse);
        }
    }
    async authorizeAJAX(req,res){
        let authResponse = this.make(req,res);
        authResponse = await this.checkAdmin(authResponse,req);
        if(authResponse.admin){
            authResponse.command = 'ACTION';
        }
        this.notifyAll(authResponse);
    }
    async fileAuth(authResponse,req,disposition){
        let user = req.session.user;
        let folderId = req.params.folderid;
        let projectId = req.params.id;
        authResponse.authorized = false;
        if(user.admin){
            authResponse.authorized = true;
        }else {
            let permission = await this.userControl.getProjectPermission(user.id, projectId);
            permission.folderPermissions.forEach(perm => {
                if (perm.folderId === folderId) {
                    if (perm[disposition]) {
                        authResponse.authorized = true;
                    }
                }
            });
        }
        if(!authResponse.authorized){
            authResponse.display = '/unauthorized';
        }else{
            authResponse.display = '/projects/project/:id/folders/folder/:folderid/file/:filename';
            authResponse.command = 'ACTION';
        }
        return authResponse;
    }
    async uploadAuth(authResponse,req){
        authResponse.authorized = false;
        let user = req.session.user;
        let folderId = req.body.folderId;
        let projectId = req.body.projectId;
        let folder = await this.projectControl.getFolder(projectId,folderId);
        if(user.admin || folder.metadata.userFolder === user.id){
            authResponse.authorized = true;
            authResponse.variables.folder = folder;
        }else{
            authResponse.authorized = false;
            authResponse.display = '/unauthorized';
        }
        return authResponse;
    }
    async folderAuth(authResponse,req){
        let user = req.session.user;
        authResponse.authorized = false;
        let projectId = req.params.id;
        let folderId = req.params.folderid;
        if(user) {
            if (user.admin) {
                authResponse.authorized = true;
            } else {
                let projectPermission = await this.userControl.getProjectPermission(user.id, projectId);
                projectPermission.folderPermissions.forEach(perm => {
                    if (perm.folderId === folderId) {
                        authResponse.authorized = true;
                        authResponse.variables.permission = perm;
                    }
                });
            }
            if (authResponse.authorized) {
                authResponse.variables.folder = await this.projectControl.getFolder(projectId, folderId);
                authResponse.display = "/projects/folders/folder";
            } else {
                authResponse.display = '/unauthorized';
            }
        }
        return authResponse
    }
    async projectAuth(authResponse,req){
        let projectId = req.params.id;
        authResponse.authorized = false;
        if(req.session.user.admin){
            authResponse.variables.project = await this.projectControl.getProject(projectId);
            authResponse.display = '/projects/project';
            authResponse.authorized = true;
        }else{
            let permission = await this.userControl.getProjectPermission(req.session.user.id,projectId);
            authResponse.variables.project = permission;
            if(permission){
                authResponse.display = '/projects/project';
                authResponse.authorized = true;
            }
        }
        if(!authResponse.authorized){
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
                    authResponse.session = true;
                    if(req.session.user.admin){
                        authResponse.admin = true;
                        authResponse.session = true;
                        authResponse.variables.users = await this.userControl.getAllUsers();
                        authResponse.variables.projects = await this.projectControl.getAllProjects();
                    }
                } else {
                    req.session.destroy();
                    authResponse.session = false;
                    authResponse = this.badSession(authResponse);
                    this.notifyAll(authResponse);
                }
            }else{
                authResponse.session = false;
                authResponse = this.badSession(authResponse);
                this.notifyAll(authResponse);
            }
        }else{
            authResponse.session = false;
            authResponse = this.badSession(authResponse);
            this.notifyAll(authResponse);
        }
        return authResponse;
    }
    async checkAdmin(authResponse,req){
        authResponse = await this.sessionAuth(authResponse,req);
        if(authResponse.session) {
            if (authResponse.admin) {
                return authResponse;
            } else {
                authResponse.command = '/redirect';
                authResponse.display = '/unauthorized';
            }
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