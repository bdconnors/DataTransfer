class FolderAddUsersFunctions{
    constructor(){}

    async addUser(){
        let dataAccessPerm = this.getDataAccessPerm();
        let input = document.getElementById('folderUserSelect');
        let userId = input.options[input.selectedIndex].value;
        return await server.send(server.make('/users/folders/permissions/add','POST',{folder:modal.functionControl.newFolder,userId:userId,perms:dataAccessPerm}));
    }
    getDataAccessPerm(){
        let perm = {view:true,download:false};
        let permInputs = document.getElementsByName('userPerms');
        permInputs.forEach(input=>{
            if(input.checked){
                if(input.value === 'download'){
                    perm.download = true;
                }
            }
        });
        return perm;
    }
    async removeUserPermission(userid,projectid,folderid){
        return await server.send(server.make('/users/folders/permissions/remove','POST',{userid:userid,projectid:projectid,folderid:folderid}));
    }

}