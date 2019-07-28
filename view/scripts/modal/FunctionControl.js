class FunctionControl{

    constructor(project,invite,newUser,permissions){
        this.project = project;
        this.invite = invite;
        this.newUser = newUser;
        this.permissions = permissions;
    }


    async perform(action,element){
        console.log('inside perform');
        let response = false;
        if(action === 'create project'){
            this.project = await this.project.createProject();
            response = this.project;
            response.display = 'create project success'
        }else if(action === 'invite users'){
            console.log('inside invite users');
            this.invitedUsers = await this.invite.getInvitedUsers(this.project.id);
            response = this.invitedUsers;
            console.log(response);
            response.display = 'invite users'
        }else if(action === 'set permissions'){
            this.folderPermissions = this.permissions.getFolderPermissions();
            response = this.folderPermissions;
            response.display = 'invite new user';
        }else if(action === 'invite new user'){
            this.user = await this.newUser.sendInvite(this.project,this.folderPermissions);
            response = this.user;
            response.display = 'new user success';
        }else if(action === 'check first name'){
            this.newUser.checkFnInput(element);
        }else if(action === 'check last name'){
            this.newUser.checkLnInput(element);
        }else if(action === 'check email'){
            this.newUser.checkEmailInput(element);
        }else if(action === 'permission click'){
            this.permissions.permissionClick();
        }else if(action === 'folder click'){
            this.permissions.folderClick(element);
        }
        return response;
    }
}
