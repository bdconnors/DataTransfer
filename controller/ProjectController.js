class ProjectController{

    constructor(model){
        this.model = model;
    }
    async createNewProject(name){
        return await this.model.createProject(name,'System');
    }
    async getAllProjects(){
        console.log('all projects request');
        return await this.model.getAllProjects();
    }
    async newUserFolders(firstname,lastname,permissions){
        return await this.model.newUserFolders(firstname,lastname,permissions);
    }
}
module.exports={ProjectController:ProjectController};