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
        authResponse.variables.storage = {user:user,permissions:projPermissions, action: 'NEW USER FOLDERS'};
        this.notifyAll(authResponse);
        delete authResponse.variables.storage;
        authResponse.variables.email = {action:'INVITED',user:user,lastEmail:false};
        this.notifyAll(authResponse);
        projPermissions = await this.projectControl.newUserFolders(firstName,lastName,projPermissions);
        for(let i = 0; i < projPermissions.length; i++){
            let lastEmail = false;
            if(i === projPermissions.length-1){
                lastEmail = true;
            }
            authResponse.variables.email = {action:'PROJECT ADD',user:user,permission:projPermissions[i],lastEmail:lastEmail};
            this.notifyAll(authResponse);
        }

    }
    async inviteExistingUser(authResponse){
        let userId = authResponse.request.body.userId;
        let permission = authResponse.request.body.permission;
        let user = await this.userControl.getUser('id', userId);
        authResponse.variables.storage = {user:user,permissions:permission, action: 'EXISTING USER FOLDER'};
        this.notifyAll(authResponse);
        delete authResponse.variables.storage;
        permission = await this.projectControl.existingUserFolder(user.firstname,user.lastname,permission);
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
                authResponse.display = '/users/authSuccess';
                authResponse.variables.email = {action:'AUTHENTICATED',user:user,lastEmail:true};
                this.notifyAll(authResponse);
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
        console.log(user);
        authResponse.response.send(user);

    }
    async getFolderUsers(authResponse){
        let projectId = authResponse.request.body.projectId;
        let folderId = authResponse.request.body.folderId;
        authResponse.response.send(await this.userControl.getFolderUsers(projectId,folderId));
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