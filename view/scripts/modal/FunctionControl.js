class FunctionControl{

    constructor(){}


    async perform(action,element){
        let response = {};
        if(action === 'create project'){
            await projectFunc.createProject().then(res=>{
                if(res) {
                    this.project = res;
                    response = res;
                    response.display = 'create project success'
                }
            });
        }else if(action === 'invite users'){
            this.invitedUsers = await inviteFunc.getInvitedUsers(this.project.id);
            response = this.invitedUsers;
            response.display = 'invite users'
        }else if(action === 'set permissions'){
            this.folderPermissions = permissionsFunc.getFolderPermissions();
            response = this.folderPermissions;
            if(element.id === 'new') {
                response.display = 'invite new user';
            }else if(element.id === 'existing'){
                this.existingUsers = await permissionsFunc.getExistingUsers();
                response.display = 'invite existing user';
            }
        }else if(action === 'invite new user'){
            this.user =  await newUserFunc.sendInvite(this.project,this.folderPermissions);
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
            let userId = input.options[input.selectedIndex].value;
            if(input.value !== 'none') {
                this.user = await existingUsersFunc.sendInvite(userId,this.project,this.folderPermissions);
                response = this.user;
                response.display = 'existing user success';
            }else{
                response.display ='invite users';
            }
        }else if(action === 'new folder'){

        }else if(action === 'rename'){
            let success;
            console.log(element);
            if(element === 'Project') {
                success = await renameFunc.rename();
            }else if(element ==='Folder'){
                console.log('inside elemet is folder');
                success = await renameFunc.renameFolder();
            }
            console.log(success);
            if(success){
                window.location = success;
            }else{
                modal.hideConfirmModal();
            }
        }else if(action ==='edit project perm'){
            this.project = JSON.parse(JSON.stringify(element));
            this.invitedUsers = await inviteFunc.getInvitedUsers(this.project.id);
            this.existingUsers =  await permissionsFunc.getExistingUsers();
            response.display = 'invite users'
        }else if(action ==='check project input'){
            projectFunc.checkProjInput(element);
        }else if(action === 'check file input'){
            uploadFileFunc.checkFileInp();
        }else if(action ==='upload file'){
            uploadFileFunc.upload();
        }else if(action === 'confirm permissions'){
            permissionsFunc.confirmPermissions(element);
        }else if(action === 'confirm existing'){
            existingUsersFunc.confirmSelection(element);
        }else if(action === 'confirm project delete'){
            console.log('inside confirm delete');
            projectFunc.confirmDelete(element);
        }else if(action === 'delete project'){
            window.location = await projectFunc.deleteProject(element);
        }else if(action === 'confirm file delete'){
            uploadFileFunc.confirmDelete(element);
        }else if(action === 'delete file'){
            window.location = await uploadFileFunc.deleteFile(element);
        }else if(action ==='confirm delete user'){
            existingUsersFunc.confirmDelete(element);
        }else if(action ==='delete user'){
            window.location = await existingUsersFunc.deleteUser(element);
        }else if(action === 'confirm permission remove'){
            inviteFunc.confirmRemovePermissions(element);
        }else if(action === 'confirm new user invite'){
            newUserFunc.confirmSendInvite();
        }else if(action === 'confirm rename'){
            renameFunc.confirmRename(element);
        }else if(action === 'confirm create project'){
            projectFunc.confirmProjectName();
        }else if(action === 'create new folder'){
            response = await newFolderFunc.createNewFolder();
            if(response.error){
                document.getElementById('folderExistsErr').style.display='block';
            }else{
                this.folder = response;
                response.display = 'new folder success';
            }
        }else if(action ==='new folder invite'){
            this.existingUsers = await inviteFunc.getInvitedUsers(this.project.id);
            console.log(this.existingUsers);
            this.invitedUsers = await newFolderFunc.getUsers();
            console.log(this.invitedUsers);
            response.display = 'new folder invite';
        }else if(action === 'new folder invite user'){
            console.log('inside invite new user function control');
            response = await newFolderFunc.inviteUser();
            if(response) {
                this.user = response;
                this.invitedUsers = await newFolderFunc.getUsers();
                response.display = 'new folder invite success';
            }else{
                document.getElementById('selectUserErr').style.visibility = 'visible';
            }
        }else if(action === 'remove folder permission'){
            response = await permissionsFunc.removeFolderPermission(element);
            this.existingUsers = await inviteFunc.getInvitedUsers(this.project.id);
            this.invitedUsers = await newFolderFunc.getUsers();
            response.display = 'new folder invite';

        }else if(action === 'delete folder'){
            window.location = await projectFunc.deleteFolder();
        }
        return response;
    }
}
