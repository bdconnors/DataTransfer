class RenameFunctions{
    constructor(){}

    async rename(){
        let newName = document.getElementById('renameInput').value;
        let projectId = document.getElementById('projectIdHidden').value;
        let url = "/projects/project/"+projectId+"/rename";

        let doesNotExist = await server.send(server.make(url,'POST',"newname="+newName));

        if(doesNotExist){
            return doesNotExist
        }else{
            document.getElementById('projExistsErr').style.display = 'block';
            document.getElementById('renameInput').style.backgroundColor = 'pink';
        }
    }
    confirmRename(){
        let name = document.getElementById('oldName').value;
        let newName = document.getElementById('renameInput').value;
        modal.showConfirmModal('Confirm Project Rename',`<p>Rename Project ${name} to Project ${newName}?</p>`,'rename');
    }

}