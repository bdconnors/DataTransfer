class RenameFunctions{
    constructor(){}

    async rename(){
        let newName = document.getElementById('renameInput').value;
        console.log(newName);
        let url;

        let type = document.getElementById('renameType').value;
        let name = document.getElementById('oldName').value;
        if(type === 'Project'){
            let projectId = document.getElementById('projectIdHidden').value;
            url = "/projects/project/"+projectId+"/rename";
        }else if(type ==='Folder'){
            let projectId = document.getElementById('projectIdHidden').value;
            let folderId = document.getElementById('folderIdHidden').value;
            url = "/projects/project/"+projectId+"/folders/folder/"+folderId+"/rename";
        }else if(type ==='File'){
            let projectId = document.getElementById('projectIdHidden').value;
            let folderId = document.getElementById('folderIdHidden').value;
            url = "/projects/project/"+projectId+"/folders/folder/"+folderId+"/file/"+name+"/rename";
        }
        return await server.send(server.make(url,'POST',"newname="+newName));
    }

}