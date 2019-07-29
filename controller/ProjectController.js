class ProjectController{

    constructor(model){
        this.model = model;
    }
    async createNewProject(name){
        return await this.model.createProject(name,'System');
    }
    async getAllProjects(){
        return await this.model.getAllProjects();
    }
    async newUserFolders(firstname,lastname,permissions){
        return await this.model.newUserFolders(firstname,lastname,permissions);
    }
    async existingUserFolder(firstname,lastname,permission){
        return await this.model.existingUserFolder(firstname,lastname,permission);
    }

}
module.exports={ProjectController:ProjectController};