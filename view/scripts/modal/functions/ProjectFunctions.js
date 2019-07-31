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
}
