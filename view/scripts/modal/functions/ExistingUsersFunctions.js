class ExistingUsersFunctions{
    constructor(){}
    async sendInvite(userId,project,folderPermissions){
        delete folderPermissions.display;
        let projectPermission = {projectId:project.id,projectName:project.name,folderPermissions:folderPermissions};
        modal.showLoadingSpinner();
        let response = await server.send(server.make('/users/project/permissions/add','POST', {
            userId:userId,
            permission:projectPermission
        }));
        modal.hideLoadingSpinner();
        return response;

    }
    async getUser(id){
        return await server.send(server.make('/users/user','GET','id='+id));
    }
    confirmSelection(element){
        let input = document.getElementById(element);
        let selectedInput = input.options[input.selectedIndex];
        let user = selectedInput.id;
        let headerText = `Confirm User Selection`;
        let body = `<p>Give ${user} permission to Project ${modal.functionControl.project.name}?</p>`;
        modal.showConfirmModal(headerText,body,'invite existing user','existingUserSelectInput');
    }
    confirmDelete(element){
        let text = 'Confirm Account Removal';
        let body = `<p>Remove ${element.name}'s Account?</p>`;
        let confirmFunction = 'delete user';
        modal.showConfirmModal(text,body,confirmFunction,element);
    }
    async deleteUser(element){
        let userId = element.id;
        return await server.send(server.make('/users/'+userId+'/delete','POST'));
    }
}