class PermissionsFunctions{
    constructor(){}

    getFolderPermissions() {
        let permInputs = document.getElementsByName('folderPerms');
        let dataPerm = this.getDataAccessPerm();
        let folderPerms=[];
        permInputs.forEach(perm=>{
            if(perm.checked){
                let id = perm.value;
                let name = perm.id;
                folderPerms.push({folderId:id,folderName:name,view:dataPerm.view,download:dataPerm.download});
            }
        });
        return folderPerms;
    }
    getDataAccessPerm(){
        let dataPerm = {view:true,download:false};
        let dataPermInputs = document.getElementsByName('userPerms');
        dataPermInputs.forEach(perm => {
            if(perm.checked){
                if(perm.value === 'download'){
                    dataPerm.view = true;
                    dataPerm.download = true;
                }
            }
        });
        return dataPerm;
    }
    async getExistingUsers(){
        return await server.send(server.make('/users','GET'))
    }
    async removePermission(element){
        let projectId = element.name;
        let userId = element.id;
        return await server.send(server.make('/users/project/permissions/remove','POST',{id:userId,projectId:projectId}));

    }
    permissionClick(){
        let view = document.getElementById('view').checked;
        let download = document.getElementById('download').checked;
        let viewLabel = document.getElementById('viewLabel');
        let downloadLabel = document.getElementById('downloadLabel');

        if(view){
            viewLabel.style.color = "green";
            downloadLabel.style.color = 'red';
        }
        if(download){
            viewLabel.style.color = 'red';
            downloadLabel.style.color = 'green';
        }
    }
    folderClick(element){
        let labelId = element.id+'Label';
        let label = document.getElementById(labelId);
        if(element.checked){
            label.style.color = 'green';
        }
        if(!element.checked){
            label.style.color = 'red';
        }
    }
    confirmPermissions(element) {
        let folderPerms = this.getFolderPermissions();
        let accessLevel;
        if(folderPerms[0].download){
           accessLevel = `<i style="color:green" class = "fa fa-eye"></i> <i style="color:green" class = "fa fa-download"></i> View and Download`;
        }else{
            accessLevel = `<i style="color:green" class = "fa fa-eye"></i> View Data Only`;
        }
        let headerText = `Proceed with Permissions?`;
        let body =`<div style="text-align:left">
        <b>Data Access Level:</b>
        <br>${accessLevel}
        </div>
        <div style="text-align:left">
        <br><b>Folder Access:</b>`;
        folderPerms.forEach(perm=>{
            body+=`<br><i style="color:green" class = "fa fa-folder-open"></i> ${perm.folderName}`;
        });
        body+=`</div>`;
        let confirmFunction = 'set permissions';
        modal.showConfirmModal(headerText,body,confirmFunction,element);
    }




}