class ExistingUsersFunctions{
    constructor(){}
    async sendInvite(userId,project,folderPermissions){
        delete folderPermissions.display;
        let projectPermission = {projectId:project.id,projectName:project.name,folderPermissions:folderPermissions};
        let $loading = $('#loadingSpinner');
        $loading.modal({backdrop: 'static', keyboard: false});
        let response = await server.send(server.make('/users/project/permissions/add','POST', {
            userId:userId,
            permission:projectPermission
        }));
        $loading.modal('hide');
        return response;

    }
    async getUser(id){
        return await server.send(server.make('/users/user','GET','id='+id));
    }
}