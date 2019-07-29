class FunctionControl{

    constructor(project,invite,newUser,existing,permissions){
        this.project = project;
        this.invite = invite;
        this.newUser = newUser;
        this.existing = existing;
        this.permissions = permissions;
    }


    async perform(action,element){
        console.log('inside perform');
        let response = {};
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
            if(element.id === 'new') {
                response.display = 'invite new user';
            }else if(element.id === 'existing'){
                this.existingUsers = await this.permissions.getExistingUsers();
                console.log(this.existingUsers);
                response.display = 'invite existing user';
            }
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
        }else if(action === 'remove permission'){
            response = await this.permissions.removePermission(element);
            this.invitedUsers = await this.invite.getInvitedUsers(this.project.id);
            response.display='invite users';
        }else if(action === 'invite existing user'){
            let input = document.getElementById(element);
            console.log(input);
            let userId = input.options[input.selectedIndex].value;
            console.log(userId);
            if(input.value !== 'none') {
                console.log('inside input value != none');
                this.user = await this.existing.sendInvite(userId,this.project,this.folderPermissions);
                response = this.user;
                console.log(response);
                response.display = 'existing user success';
            }else{
                response.display ='invite users';
            }
        }
        return response;
    }
}
