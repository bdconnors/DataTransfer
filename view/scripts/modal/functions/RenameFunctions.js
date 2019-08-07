class RenameFunctions{
    constructor(){}

    async rename(){
        let newName = document.getElementById('renameInput').value;
        let projectId = functionControl.project.id;
        let url = "/projects/project/"+projectId+"/rename";

        let doesNotExist = await server.send(server.make(url,'POST',"newname="+newName));

        if(doesNotExist){
            return doesNotExist
        }else{
            document.getElementById('projExistsErr').style.display = 'block';
            document.getElementById('renameInput').style.backgroundColor = 'pink';
        }
    }
    async renameFolder(){
        console.log('inside rename foolder func');
        let newName = document.getElementById('renameInput').value;
        let projectId = functionControl.project.id;
        let folderId = functionControl.folder.id;
        let url = "/projects/project/"+projectId+"/folders/folder/"+folderId+"/rename";
        let doesNotExist = await server.send(server.make("/projects/project/"+projectId+"/folders/folder/"+newName+"/exists",'GET'));
        console.log(doesNotExist);
        if(!doesNotExist){
            console.log('inside does not exist');
            return await server.send(server.make(url,'POST',"newname="+newName));
        }else{
            document.getElementById('existsErr').style.display = 'block';
            document.getElementById('renameInput').style.backgroundColor = 'pink';
        }
    }
    confirmRename(type){
        let name = document.getElementById('oldName').value;
        let newName = document.getElementById('renameInput').value;
        modal.showConfirmModal('Confirm Folder Rename',`<p>Rename ${type} ${name} to ${type} ${newName}?</p>`,'rename',`${type}`);
    }

}