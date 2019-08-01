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
        let $confirmPermsModal = $('#confirmPermsModal');
        let $confirmPermsFooter = $('#confirmPermsFooter');
        $confirmPermsFooter.append(`<button type="button"  onclick="modal.perform('cancel permissions')" class="btn btn-outline-dark btn-block button"><i class="fa fa-user"></i> Cancel</button>`);
        $confirmPermsFooter.append(`<button type="button" id="${element.id}" onclick="modal.perform('set permissions',this)" class="btn btn-outline-dark btn-block button"><i class="fa fa-user"></i> Confirm</button>`);
        $confirmPermsModal.modal({backdrop: 'static', keyboard: false});
    }
    hideConfirm(){
        let $confirmPermsModal = $('#confirmPermsModal');
        $confirmPermsModal.modal('hide');
    }



}