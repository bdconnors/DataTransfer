class ProjectFunctions{
    constructor(){}

    async createProject(){
        let name = $('#createProjectName').val();
        let data = 'name=' + name;

        let response = await server.send(server.make('/projects/create','POST',data));
        if(response.error){
            document.getElementById('createProjectName').style.backgroundColor = 'pink';
            document.getElementById('projExistsErr').style.display='block';
            return false;
        }else{
            return response;
        }
    }
    checkProjInput(element){
        document.getElementById('projExistsErr').style.display = 'none';
        element.style.backgroundColor = "";
    }
    confirmProjectName(){
        let name = $('#createProjectName').val();
        modal.showConfirmModal('Confirm Project Name',`<p>Create Project ${name}?</p>`,'create project');
    }
    confirmDelete(element){
        console.log('inside proj func confirm delete');
        let text = 'Confirm Delete Project';
        let body = `<p>Delete Project ${element.name}?</p>`;
        let confirmFunction = 'delete project';
        modal.showConfirmModal(text,body,confirmFunction,element);
    }
    async deleteProject(element){
        let projectId=element.id;
        return await server.send(server.make('/projects/project/'+projectId+'/delete','POST'));
    }
    async deleteFolder(){
        let projectId = functionControl.project.id;
        let folderId = functionControl.folder.id;
        return await server.send(server.make('/projects/project/'+projectId+'/folders/folder/'+folderId+'/delete','POST'));
    }
}
