class ProjectController{

    constructor(model){
        this.model = model;
    }
    async createNewProject(name){
        return await this.model.createProject(name,'System');
    }
    async getProject(id){
        return await this.model.getProject(id);
    }
    async getFolder(projectid,folderid){
        return await this.model.getFolder(projectid,folderid);
    }
    async createNewFolder(project,name,author){
        return await this.model.createNewFolder(project,name,author);
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