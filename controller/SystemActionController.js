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
        if(newUserFolder) {
            let perms = {view: true, download: true};
            user = await this.userControl.addFolderPermission(user.id, newUserFolder, perms);
            authResponse.variables.storage = {folder: newUserFolder, action: 'NEW USER FOLDER'};
            this.notifyAll(authResponse);
            delete authResponse.variables.storage;
        }
        authResponse.variables.email = {action: 'INVITED', user: user};
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
        console.log(permission);
        user.projectPermissions.push(permission);
        user = await this.userControl.updateUser('id',user.id,{$set:{projectPermissions:user.projectPermissions}});
        authResponse.variables.email = {action:'PROJECT ADD',user:user,permission:permission};
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
            }).catch((err)=>{console.log(err)});
    }
    async getAllUsers(authResponse){
        let users = await this.userControl.getAllUsers();
        authResponse.response.send(users);
    }
    async getProjectUsers(authResponse){
        if(authResponse.request.query.id){
            let id = authResponse.request.query.id;
            let projectUsers = await this.userControl.getProjectUsers(id);
            console.log(projectUsers);
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
            if(project.name === name){exists = true;}
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
        let exists = await this.projectControl.folderExists(projectId,folderName);
        if(exists){
            authResponse.response.send({error:'FOLDER EXISTS'});
        }else{
            let project = await this.projectControl.getProject(projectId);
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
        }).catch((err)=>{console.log(err)});
    }
    async addUserFolderPermission(authResponse){
        let folderId = authResponse.request.body.folderId;
        console.log(folderId);
        let projectId = authResponse.request.body.projectId;
        console.log(projectId);
        let userId = authResponse.request.body.userId;
        let folder = await this.projectControl.getFolder(projectId,folderId);
        console.log(folder);
        let userProjectPerm = await this.userControl.getProjectPermission(userId,projectId);
        let folderPerm = userProjectPerm.folderPermissions[0];
        console.log(userProjectPerm);
        let perms = {view:folderPerm.view,download:folderPerm.download};
        let result = await this.userControl.addFolderPermission(userId,folder,perms);
        console.log(result);
        authResponse.response.send(result);

    }
    async getFolderUsers(authResponse){
        let projectId = authResponse.request.query.projectId;
        let folderId = authResponse.request.query.folderId;
        let folderUsers = await this.userControl.getFolderUsers(projectId,folderId);
        console.log(folderUsers);
        authResponse.response.send(folderUsers);
    }
    async removeFolderPermission(authResponse){
        let userid = authResponse.request.body.userid;
        let projectid = authResponse.request.body.projectid;
        let folderid = authResponse.request.body.folderid;
        this.userControl.removeFolderPermission(userid,projectid,folderid).then(result=>{
            authResponse.response.send(result);
        });

    }
    async streamFile(authResponse){
        let projectId = authResponse.request.params.id;
        let folderId = authResponse.request.params.folderid;
        let fileName = authResponse.request.params.filename;
        let folder = await this.projectControl.getFolder(projectId,folderId);
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
            this.projectControl.deleteProject(projectId).then(()=>{
                this.userControl.deleteProject(projectId).then(()=>{
                    authResponse.variables.storage = {};
                    authResponse.variables.storage.project = project;
                    authResponse.variables.storage.action = 'DELETE PROJECT';
                    this.notifyAll(authResponse);
                })
            })
        }).catch(err=>{console.log(err)});
    }
    async renameProject(authResponse){
        let projectId = authResponse.request.params.id;
        let newName = authResponse.request.body.newname;
        let exists = await this.projectControl.projectExists(newName);
        console.log(exists);
        if(!exists) {
            this.projectControl.renameProject(projectId, newName).then((project) => {
                this.userControl.renameProject(projectId, newName).then(() => {
                    authResponse.variables.storage = {};
                    authResponse.variables.storage.project = project;
                    authResponse.variables.storage.newName = newName;
                    authResponse.variables.storage.action = 'RENAME PROJECT';
                    console.log(authResponse);
                    this.notifyAll(authResponse);
                })
            }).catch(err => {
                console.log(err)
            });
        }else{
            authResponse.response.send(false);
        }
    }
    async renameFolder(authResponse){
        let projectId = authResponse.request.params.id;
        let folderId = authResponse.request.params.folderid;
        let newName = authResponse.request.body.newname;
        console.log(projectId);
        console.log(folderId);
        console.log(newName);
        this.projectControl.renameFolder(projectId,folderId,newName).then(folder=>{
            this.userControl.renameFolder(projectId,folderId,newName).then(()=>{
                authResponse.variables.storage = {};
                authResponse.variables.storage.folder = folder;
                authResponse.variables.storage.newName = newName;
                authResponse.variables.storage.action = 'RENAME FOLDER';
                this.notifyAll(authResponse);
            })
        }).catch(err=>{console.log(err)});
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
        }).catch((err=>{console.log(err)}));
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
            console.log(err)
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
        authResponse.variables.storage = {};
        authResponse.variables.storage.action ='WRITE FILE';
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
    async userExists(authResponse){
        let exists = await this.userControl.getUser('email',authResponse.request.params.email);
        authResponse.response.send(exists);
    }
    async fileExists(authResponse){
        let projectId = authResponse.request.params.id;
        let folderId = authResponse.request.params.folderid;
        let fileName = authResponse.request.params.filename;
        let exists = await this.projectControl.fileExists(projectId,folderId,fileName);
        authResponse.response.send(exists);
    }
    async folderExists(authResponse){
        console.log('inside folder exists func sys action');
        let projectId = authResponse.request.params.id;
        let folderName = authResponse.request.params.foldername;
        console.log(projectId);
        console.log(folderName);
        let exists = await this.projectControl.folderExists(projectId,folderName);
        console.log(exists);
        authResponse.response.send(exists);
    }
    async accountRecovery(authResponse){
        let email = authResponse.request.body.email;
        let recoveredAccount = await this.userControl.resetPassword(email);
        if(recoveredAccount){
            authResponse.variables.email = {action:'RECOVER ACCOUNT',user:recoveredAccount};
            this.notifyAll(authResponse)
        }else{
            authResponse.response.send(false);
        }

    }
    async accountRecoveryReset(authResponse){
        let account = authResponse.variables.account;
        let newPassword = authResponse.request.body.password;
        delete account.authCode;
        account.password = newPassword;
        let response = await this.userControl.submitResetPassword(account);
        authResponse.response.send(response);
    }

    performAction(authResponse){
        console.log(authResponse.display);
        if(authResponse.display === '/users/invite'){
            this.inviteNewUser(authResponse).catch((err)=>{console.log(err)});
        }else if(authResponse.display === '/users/authenticate'){
            this.updateNewUser(authResponse).catch((err)=>{console.log(err)});
        }else if(authResponse.display === '/projects/create'){
            this.createNewProject(authResponse).catch((err)=>{console.log(err)});
        }else if(authResponse.display === '/users'){
            this.getAllUsers(authResponse).catch((err)=>{console.log(err)});
        }else if(authResponse.display === '/users/project'){
            this.getProjectUsers(authResponse).catch((err)=>{console.log(err)});
        }else if(authResponse.display === '/users/project/permissions/remove'){
            this.removeUserProjectPermission(authResponse).catch((err)=>{console.log(err)});
        }else if(authResponse.display === '/users/user'){
            this.getUser(authResponse).catch(err=>{console.log(err)});
        }else if(authResponse.display === '/users/project/permissions/add'){
            this.inviteExistingUser(authResponse).catch(err=>{console.log(err)});
        }else if(authResponse.display === '/projects/project/:id/folders/new'){
            this.createNewProjectFolder(authResponse).catch(err=>{console.log(err)})
        }else if(authResponse.display === '/users/folders/permissions/add') {
            this.addUserFolderPermission(authResponse).catch((err) => {console.log(err)});
        }else if(authResponse.display === '/users/folders'){
            this.getFolderUsers(authResponse).catch(err=>{console.log(err)});
        }else if(authResponse.display === '/users/folders/permissions/remove'){
            this.removeFolderPermission(authResponse).catch(err=>{console.log(err)});
        }else if(authResponse.display === '/projects/folders/upload'){
            this.uploadFile(authResponse).catch(err=>{console.log(err)});
        }else if(authResponse.display === '/projects/project/:id/folders/folder/:folderid/file/:filename'){
            this.streamFile(authResponse).catch(err=>{console.log(err)});
        }else if(authResponse.display ==='/projects/project/:id/folders/folder/:folderid/delete'){
            this.deleteFolder(authResponse).catch(err=>{console.log(err)});
        }else if(authResponse.display === '/projects/project/:id/delete'){
            this.deleteProject(authResponse).catch(err=>{console.log(err)});
        }else if(authResponse.display === '/projects/project/:id/folders/folder/:folderid/file/:filename/delete'){
            this.deleteFile(authResponse).catch((err)=>{console.log(err)});
        }else if(authResponse.display === '/projects/project/:id/rename'){
            this.renameProject(authResponse).catch(err=>{console.log(err)});
        }else if(authResponse.display === '/users/:email/exists'){
            this.userExists(authResponse).catch(err=>{console.log(err)});
        }else if(authResponse.display === '/projects/project/:id/folders/folder/:folderid/file/:filename/exists'){
            this.fileExists(authResponse).catch((err)=>{console.log(err)});
        }else if(authResponse.display ==='/projects/project/:id/folders/folder/:foldername/exists'){
            console.log('inside observer sys action exists');
            this.folderExists(authResponse).catch((err)=>{console.log(err)});
        }else if(authResponse.display ==='/projects/project/:id/folders/folder/:folderid/rename'){
            console.log('inside observer sys action');
            this.renameFolder(authResponse).catch(err=>{console.log(err)});
        }else if(authResponse.display ==='/users/recovery'){
            this.accountRecovery(authResponse).catch((err)=>{console.log(err)});
        }else if(authResponse.display ==='/users/recovery/:authCode'){
            this.accountRecoveryReset(authResponse).catch(err=>{console.log(err)});
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