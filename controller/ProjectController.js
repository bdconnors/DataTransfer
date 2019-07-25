class ProjectController{

    constructor(model){
        this.model = model;
    }
    async createNewProject(name){

        let project =  await this.model.createProject(name,'System');
        return project;
    }
}
module.exports={ProjectController:ProjectController};