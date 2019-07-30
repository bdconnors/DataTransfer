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
        console.log('inside controller get folder');
        console.log(projectid);
        console.log(folderid);
        return await this.model.getFolder(projectid,folderid);
    }
    async createNewFolder(project,name,author){
        return await this.model.createNewFolder(project,name,author);
    }
    async getAllProjects(){
        return await this.model.getAllProjects();
    }
    async addFile(folder,file){
        return await this.model.addFile(folder,file);
    }
    async deleteFile(projectid,folderid,filename){
        return await this.model.deleteFile(projectid,folderid,filename);
    }
    async deleteFolder(projectId,folderId){
        return await this.model.deleteFolder(projectId,folderId);
    }
    async deleteProject(projectId){
        return await this.model.deleteProject(projectId);
    }
    async renameProject(projectId,newname){
        return await this.model.renameProject(projectId,newname);
    }
    async newUserFolder(user){
        return await this.model.newUserFolder(user);
    }
    async existingUserFolder(user,permission){
        return await this.model.existingUserFolder(user,permission);
    }
    async renameFolder(projectid,folderid,newname){
        return await this.model.renameFolder(projectid,folderid,newname);
    }


}
module.exports={ProjectController:ProjectController};