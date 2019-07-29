class NewFolderFunctions{
    constructor(){}

   async createNewFolder(){
        let name = document.getElementById('newFolderName').value;
        let url = window.location.href.split('/');
        url[5] = url[5].replace('#','');
        console.log(url[5]);
        url.splice(0,1);
        url.splice(0,1);
        url.splice(0,1);
        let addFolderUrl = '/';
        addFolderUrl+= url.join('/');
        addFolderUrl+='/folders/new';
        console.log(addFolderUrl);
        return await server.send(server.make(addFolderUrl,'POST','name='+name));
    }
    async getUsers(projectId,folderId){
        console.log('inside get folder users');
        return await server.send(server.make('/users/folders','GET',{projectId:projectId,folderId:folderId})).catch(err=>{console.log(err)});
    }
}