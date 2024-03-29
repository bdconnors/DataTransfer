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
    async fileExists(projectid,folderid,filename){
        return await this.model.fileExists(projectid,folderid,filename);
    }
    async projectExists(projectName){
        return await this.model.projectExists(projectName);
    }
    async folderExists(projectId,folderName){
        console.log('proj controller project id '+projectId);
        console.log('proj controller folderName '+folderName);
        return await this.model.folderExists(projectId,folderName);
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
    async renameFolder(projectId,folderId,newname){
        return await this.model.renameFolder(projectId,folderId,newname);
    }
    async newUserFolder(user){
        return await this.model.newUserFolder(user);
    }
    async existingUserFolder(user,permission){
        return await this.model.existingUserFolder(user,permission);
    }
    /**async renameFolder(projectid,folderid,newname){
        return await this.model.renameFolder(projectid,folderid,newname);
    }**/
}
module.exports={ProjectController:ProjectController};