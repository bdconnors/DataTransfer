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
        console.log(permission);
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
        this.projectControl.createNewProject(name).then((project)=>{
            authResponse.response.send(project);
        }).catch(err=>{
            authResponse.response.send(err);
        });
    }
    async removeUserProjectPermission(authResponse){
        let projectId = authResponse.request.body.projectId;
        let userId = authResponse.request.body.id;
        this.userControl.removeProjectPermission(userId,projectId).then(project=>{
            authResponse.response.send(project);
        }).catch((err)=>{throw err});
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