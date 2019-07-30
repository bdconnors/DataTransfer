class FunctionControl{

    constructor(){}


    async perform(action,element){
        console.log('inside perform');
        let response = {};
        if(action === 'create project'){
            this.project = await projectFunc.createProject();
            response = this.project;
            response.display = 'create project success'
        }else if(action === 'invite users'){
            console.log('inside invite users');
            this.invitedUsers = await inviteFunc.getInvitedUsers(this.project.id);
            response = this.invitedUsers;
            console.log(response);
            response.display = 'invite users'
        }else if(action === 'set permissions'){
            this.folderPermissions = permissionsFunc.getFolderPermissions();
            response = this.folderPermissions;
            if(element.id === 'new') {
                response.display = 'invite new user';
            }else if(element.id === 'existing'){
                this.existingUsers = await permissionsFunc.getExistingUsers();
                console.log(this.existingUsers);
                response.display = 'invite existing user';
            }
        }else if(action === 'invite new user'){
            this.user = await newUserFunc.sendInvite(this.project,this.folderPermissions);
            response = this.user;
            response.display = 'new user success';
        }else if(action === 'check first name'){
            newUserFunc.checkFnInput(element);
        }else if(action === 'check last name'){
            newUserFunc.checkLnInput(element);
        }else if(action === 'check email'){
            newUserFunc.checkEmailInput(element);
        }else if(action === 'permission click'){
            permissionsFunc.permissionClick();
        }else if(action === 'folder click'){
            permissionsFunc.folderClick(element);
        }else if(action === 'remove permission'){
            response = await permissionsFunc.removePermission(element);
            this.invitedUsers = await inviteFunc.getInvitedUsers(this.project.id);
            response.display='invite users';
        }else if(action === 'invite existing user'){
            let input = document.getElementById(element);
            console.log(input);
            let userId = input.options[input.selectedIndex].value;
            console.log(userId);
            if(input.value !== 'none') {
                console.log('inside input value != none');
                this.user = await existingUsersFunc.sendInvite(userId,this.project,this.folderPermissions);
                response = this.user;
                console.log(response);
                response.display = 'existing user success';
            }else{
                response.display ='invite users';
            }
        }else if(action === 'new folder'){
            this.newFolder = await newFolderFunc.createNewFolder();
            console.log(this.newFolder);
            this.existingUsers = await inviteFunc.getInvitedUsers(this.newFolder.projectId);
            this.newFolderUsers = await newFolderFunc.getUsers(this.newFolder.projectId,this.newFolder.folderId);
            response = this.newFolder;
            response.display='new folder success';
        }else if( action === 'folder add user'){
            this.user = await folderAddUsersFunc.addUser();
            this.newFolderUsers = await newFolderFunc.getUsers(this.newFolder.projectId,this.newFolder.id);
            response = this.user;
            response.display="folder add user success";
        }else if(action === 'folder remove permission'){
            response = await folderAddUsersFunc.removeUserPermission(element.id,this.newFolder.projectId,this.newFolder.id);
            this.newFolderUsers = await newFolderFunc.getUsers(this.newFolder.projectId,this.newFolder.id);
            response.display ='folder add user';
        }else if(action === 'upload file'){
            uploadFileFunc.uploadFile();
        }else if(action === 'rename'){
            console.log('inside func control');
            window.location = await renameFunc.rename();
        }else if(action ==='edit project perm'){
            this.project = JSON.parse(JSON.stringify(element));
            this.invitedUsers = await inviteFunc.getInvitedUsers(this.project.id);
            this.existingUsers =  await permissionsFunc.getExistingUsers();
            response.display = 'invite users'
        }
        return response;
    }
}
