const mimeType = require('mime-types');
const path = require('path');

class SystemActionController{

    constructor(userControl,projectControl){
        this.userControl = userControl;
        this.projectControl = projectControl;
        this.observers = [];
    }
    async inviteNewUser(authResponse){
        let userObj = authResponse.request.body;
        let firstName = userObj.firstname;
        let lastName = userObj.lastname;
        let email = userObj.email;
        let projPermissions = userObj.projectPermissions;
        let user = await this.userControl.inviteNewUser(firstName,lastName,email,projPermissions);
        let newUserFolder = await this.projectControl.newUserFolder(user);
        let perms = {view:true,download:true};
        user = await this.userControl.addFolderPermission(user.id,newUserFolder,perms);
        authResponse.variables.storage = {folder:newUserFolder, action: 'NEW USER FOLDER'};
        this.notifyAll(authResponse);
        delete authResponse.variables.storage;
        authResponse.variables.email = {action:'INVITED',user:user};
        this.notifyAll(authResponse);
    }
    async inviteExistingUser(authResponse){
        let userId = authResponse.request.body.userId;
        let permission = authResponse.request.body.permission;
        let user = await this.userControl.getUser('id', userId);
        authResponse.variables.storage = {user:user,permissions:permission, action: 'EXISTING USER FOLDER'};
        this.notifyAll(authResponse);
        delete authResponse.variables.storage;
        permission = await this.projectControl.existingUserFolder(user,permission);
        user.projectPermissions.push(permission);
        user = await this.userControl.updateUser('id',user.id,{$set:{projectPermissions:user.projectPermissions}});
        authResponse.variables.email = {action:'PROJECT ADD',user:user,permission:permission,lastEmail:true};
        this.notifyAll(authResponse);
    }

    async updateNewUser(authResponse){
        let authCode = authResponse.request.query.authCode;
        let phone = authResponse.request.body.phone;
        let password = authResponse.request.body.password;
        this.userControl.updateNewUser(authCode,phone,password)
            .then(user=>{
                authResponse.variables.email = {action:'AUTHENTICATED',user:user,lastEmail:true};
                this.notifyAll(authResponse);
                authResponse.display = '/users/authSuccess';
                authResponse.command = 'DISPLAY';
                authResponse.variables.user = user;
            })
            .catch((err)=>{throw err});
    }

    async getAllUsers(authResponse){
        let users = await this.userControl.getAllUsers();
        authResponse.response.send(users);

    }
    async getProjectUsers(authResponse){
        if(authResponse.request.query.id){
            let id = authResponse.request.query.id;
            let projectUsers = await this.userControl.getProjectUsers(id);
            authResponse.response.send(projectUsers);
        }
    }
    async getUser(authResponse){
        if(authResponse.request.query.id){
            let userId = authResponse.request.query.id;
            let user = await this.userControl.getUser('id',userId);
            authResponse.response.send(user);
        }
    }
    async createNewProject(authResponse){
        let name = authResponse.request.body.name;
        let allProjects = await this.projectControl.getAllProjects();
        let exists = false;
        allProjects.forEach(project=>{
            if(project.name === name){
                exists = true;
            }
        });
        if(exists){
            authResponse.response.send({error:'PROJECT EXISTS'});
        }else {
            let project = await this.projectControl.createNewProject(name);
            authResponse.variables.storage = {project: project, action: 'CREATE PROJECT'};
            this.notifyAll(authResponse);
        }
    }
    async createNewProjectFolder(authResponse){
        let projectId = authResponse.request.params.id;
        let folderName = authResponse.request.body.name;
        let project = await this.projectControl.getProject(projectId);
        let exists = false;
        project.folders.forEach(folder=>{
            if(folder.name === folderName){
                exists = true;
            }
        });
        if(exists){
            authResponse.response.send({error:'FOLDER EXISTS'});
        }else{
            authResponse.variables.storage = {project:project,foldername:folderName, action: 'NEW PROJECT FOLDER'};
            this.notifyAll(authResponse);
            delete authResponse.variables.storage;
            let folder = await this.projectControl.createNewFolder(project,folderName,authResponse.request.session.user);
            authResponse.response.send(folder);
        }

    }
    async removeUserProjectPermission(authResponse){
        let projectId = authResponse.request.body.projectId;
        let userId = authResponse.request.body.id;
        this.userControl.removeProjectPermission(userId,projectId).then(project=>{
            authResponse.response.send(project);
        }).catch((err)=>{throw err});
    }
    async addUserFolderPermission(authResponse){
        let folder = authResponse.request.body.folder;
        let userId = authResponse.request.body.userId;
        let perms = authResponse.request.body.perms;
        let user = await this.userControl.addFolderPermission(userId,folder,perms);
        authResponse.response.send(user);

    }
    async getFolderUsers(authResponse){
        let projectId = authResponse.request.query.projectId;
        let folderId = authResponse.request.query.folderId;
        let folderUsers = await this.userControl.getFolderUsers(projectId,folderId);
        authResponse.response.send(folderUsers);
    }
    async removeFolderPermission(authResponse){
        let userid = authResponse.request.body.userid;
        let projectid = authResponse.request.body.projectid;
        let folderid = authResponse.request.body.folderid;
        let response = await this.userControl.removeFolderPermission(userid,projectid,folderid);
        authResponse.response.send(response);
    }
    async streamFile(authResponse){
        let projectId = authResponse.request.params.id;
        console.log(projectId);
        let folderId = authResponse.request.params.folderid;
        console.log(folderId);
        let fileName = authResponse.request.params.filename;
        console.log(fileName);
        let folder = await this.projectControl.getFolder(projectId,folderId);
        console.log(folder);
        authResponse.variables.storage.action = 'STREAM FILE';
        authResponse.variables.storage.file = fileName;
        authResponse.variables.storage.path = folder.projectName+'/'+folder.name+'/'+fileName;
        this.notifyAll(authResponse);
        let activity = authResponse.variables.activity = {};
        activity.user = authResponse.request.session.user;
        activity.date = new Date();
        if(authResponse.variables.storage.disposition ==='attachment'){
            activity.action = 'downloaded';
        }else if(authResponse.variables.storage.disposition ==='inline'){
            activity.action = 'viewed';
        }
        activity.target = fileName;
        activity.targetType= 'file';
        delete authResponse.variables.storage;
        this.notifyAll(authResponse);
    }
    async deleteProject(authResponse){
        let projectId = authResponse.request.params.id;
        this.projectControl.getProject(projectId).then(project=>{
            console.log('inside delete project action');
            console.log(project);
            this.projectControl.deleteProject(projectId).then(()=>{
                console.log('inside delete project db ref');
                this.userControl.deleteProject(projectId).then(()=>{
                    console.log('inside delete project permissions');
                    authResponse.variables.storage = {};
                    authResponse.variables.storage.project = project;
                    authResponse.variables.storage.action = 'DELETE PROJECT';
                    this.notifyAll(authResponse);
                })
            })
        }).catch(err=>{throw err});
    }
    async renameProject(authResponse){
        let projectId = authResponse.request.params.id;
        let newName = authResponse.request.body.newname;
        this.projectControl.renameProject(projectId,newName).then((project)=>{
            this.userControl.renameProject(projectId,newName).then(()=>{
                authResponse.variables.storage ={};
                authResponse.variables.storage.project = project;
                authResponse.variables.storage.newName = newName;
                authResponse.variables.storage.action = 'RENAME PROJECT';
                this.notifyAll(authResponse);
            })
        }).catch(err=>{throw err});
    }
    async deleteFolder(authResponse){
        let folderId = authResponse.request.params.folderid;
        let projectId = authResponse.request.params.id;
        this.projectControl.getFolder(projectId,folderId).then(folder=>{
            this.projectControl.deleteFolder(projectId,folderId).then(()=>{
                this.userControl.deleteFolder(projectId,folderId).then(()=>{
                        authResponse.variables.storage ={};
                        authResponse.variables.storage.action ="DELETE FOLDER";
                        authResponse.variables.storage.folder = folder;
                        this.notifyAll(authResponse);
                })
            })
        }).catch((err=>{throw err}));
    }
    async deleteFile(authResponse) {
        let projectId = authResponse.request.params.id;
        let folderId = authResponse.request.params.folderid;
        let fileName = authResponse.request.params.filename;
        this.projectControl.getFolder(projectId, folderId).then(folder => {
            this.projectControl.deleteFile(projectId,folderId,fileName).then(()=>{
                authResponse.variables.storage = {};
                authResponse.variables.storage.action ='DELETE FILE';
                authResponse.variables.storage.folder = folder;
                authResponse.variables.storage.file = fileName;
                this.notifyAll(authResponse);
            });
        }).catch(err => {
            throw err
        });
    }
    async uploadFile(authResponse){
        let untrimmedData = authResponse.request.body.data.split(',');
        let data = untrimmedData[1];
        let fileName = authResponse.request.body.name;
        let size = authResponse.request.body.size;
        let folder = authResponse.variables.folder;
        let filepath = folder.projectName+'/'+folder.name+'/'+fileName;
        let ext = path.extname(fileName);
        let mime = mimeType.lookup(ext);
        console.log(authResponse.variables);
        authResponse.variables.storage = {};
        console.log(authResponse.variables.storage);
        authResponse.variables.storage.action ='WRITE FILE';
        console.log(authResponse.variables.storage.action);
        authResponse.variables.storage.path = filepath;
        authResponse.variables.storage.data = data;
        this.notifyAll(authResponse);
        let user = authResponse.request.session.user;
        let author = user.firstname+' '+user.lastname;
        let file = {name:fileName,ext:ext,mime:mime,size:size,author:author};
        let response = await this.projectControl.addFile(folder,file);
        let activity = authResponse.variables.activity = {};
        activity.user = user;
        activity.date = new Date();
        activity.action = 'uploaded';
        activity.target = fileName;
        activity.targetType= 'file';
        delete authResponse.variables.storage;
        this.notifyAll(authResponse);
        authResponse.response.send(response);
    }
    performAction(authResponse){

        if(authResponse.display === '/users/invite'){
            this.inviteNewUser(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/users/authenticate'){
            this.updateNewUser(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/projects/create'){
            this.createNewProject(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/users'){
            this.getAllUsers(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/users/project'){
            this.getProjectUsers(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/users/project/permissions/remove'){
            this.removeUserProjectPermission(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/users/user'){
            this.getUser(authResponse).catch(err=>{throw err});
        }else if(authResponse.display === '/users/project/permissions/add'){
            this.inviteExistingUser(authResponse).catch(err=>{throw err});
        }else if(authResponse.display === '/projects/project/:id/folders/new'){
            this.createNewProjectFolder(authResponse).catch(err=>{throw err})
        }else if(authResponse.display === '/users/folders/permissions/add') {
            this.addUserFolderPermission(authResponse).catch((err) => {throw err});
        }else if(authResponse.display === '/users/folders'){
            this.getFolderUsers(authResponse).catch(err=>{throw err});
        }else if(authResponse.display === '/users/folders/permissions/remove'){
            this.removeFolderPermission(authResponse).catch(err=>{throw err});
        }else if(authResponse.display === '/projects/folders/upload'){
            this.uploadFile(authResponse).catch(err=>{throw err});
        }else if(authResponse.display === '/projects/project/:id/folders/folder/:folderid/file/:filename'){
            this.streamFile(authResponse).catch(err=>{throw err});
        }else if(authResponse.display ==='/projects/project/:id/folders/folder/:folderid/delete'){
            this.deleteFolder(authResponse).catch(err=>{throw err});
        }else if(authResponse.display === '/projects/project/:id/delete'){
            this.deleteProject(authResponse).catch(err=>{throw err});
        }else if(authResponse.display === '/projects/project/:id/folders/folder/:folderid/file/:filename/delete'){
            this.deleteFile(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/projects/project/:id/rename'){
            this.renameProject(authResponse).catch(err=>{throw err});
        }

    }
    notify(authResponse){
        if(authResponse.command === 'ACTION'){
            this.performAction(authResponse);
        }
    }
    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(authResponse){

        this.observers.map(observer => observer.notify(authResponse));

    }

}
module.exports={SystemActionController:SystemActionController};