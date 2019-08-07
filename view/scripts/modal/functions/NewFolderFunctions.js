class NewFolderFunctions{
    constructor(){
        this.count = 0;
    }

   async createNewFolder(){
       console.log('creating new folder');
        let name = document.getElementById('newFolderName').value;
        let url = window.location.href.split('/');
        url[5] = url[5].replace('#','');
        url.splice(0,1);
        url.splice(0,1);
        url.splice(0,1);
        let addFolderUrl = '/';
        addFolderUrl+= url.join('/');
        addFolderUrl+='/folders/new';
        return await server.send(server.make(addFolderUrl,'POST','name='+name));
    }
    async inviteUser() {
        this.count++;
        console.log('inside invite user');
        console.log(this.count);
        let response = false;
        let input = document.getElementById('existingUserSelectInput');
        let userId = input.options[input.selectedIndex].value;
        if (userId !== 'none') {
            let projectId = functionControl.project.id;
            let folderId = functionControl.folder.id;
            response = await server.send(server.make('/users/folders/permissions/add', 'POST', {
                projectId: projectId,
                folderId: folderId,
                userId: userId
            }));
            return response;
        }
    }
    async getUsers(){
        let projectId = functionControl.project.id;
        let folderId = functionControl.folder.id;
        console.log(projectId);
        console.log(folderId);
        return await server.send(server.make('/users/folders','GET',{projectId:projectId,folderId:folderId}));
    }
}