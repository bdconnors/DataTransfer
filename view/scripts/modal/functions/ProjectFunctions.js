class ProjectFunctions{
    constructor(){}

    async createProject(){
        let name = $('#createProjectName').val();
        let data = 'name=' + name;
        return await server.send(server.make('/projects/create','POST',data));
    }
}
