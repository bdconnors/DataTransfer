const uuid = require('uuid');
class ProjectsRepo {

    constructor(Projects){
        this.Projects = Projects;
        this.observers = [];
        this.defaultFolders = ['Intellectual Property','Regulatory Affairs','Clinical Information','Market Analysis','Business Development','Misc'];
    }
    async createProject(name,author){
        let project = this.make(name,author);
        return await project.save();
    }
    async getProject(id){
        return await this.Projects.findOne({id:id},{_id:0});

    }
    async getFolder(projectid,folderid) {
        let results = await this.Projects.findOne({id: projectid}, {folders: {$elemMatch: {id: folderid}}}, {_id: 0});
        let response =  false;
        if(results.folders[0]){
            response = results.folders[0];
        }
        return response;

    }
    async folderExists(projectid,foldername) {
        let results = await this.Projects.findOne({id: projectid}, {folders: {$elemMatch: {name: foldername}}}, {_id: 0});
        let response =  false;
        if(results.folders[0]){
            response = results.folders[0];
        }
        return response;

    }
    async createNewFolder(project,foldername,author){
        let authorName = author.firstname+' '+author.lastname;
        let folder = this.makeFolder(project.id,project.name,foldername,authorName);
        let update = await this.Projects.updateOne({id:project.id},{$push:{folders:folder}});
        if(update.nModified === 1){
            update = await this.getFolder(project.id,folder.id);
        }
        return update;
    }
    async getAllProjects(){
        return await this.Projects.find({},{_id:0});
    }
    async newUserFolder(user){
        let project = user.projectPermissions[0];
        let folderName = user.firstname+" "+user.lastname+"'s Uploads";
        let userFolder = this.makeFolder(project.projectId,project.projectName,folderName,'System',user.id);
        let exist = await this.folderExists(project.projectId,folderName);
        let results = false;
        if(!exist) {
            results = await this.Projects.updateOne({id: project.projectId}, {$push: {folders: userFolder}});
            if (results.nModified === 1) {
                results = userFolder;
            }
        }
        return results;
    }
    async fileExists(projectid,folderid,filename){
        let results = await this.Projects.find({id:projectid,folders: { "$elemMatch": {id:folderid,files: {"$elemMatch": {"name": filename}}}}});
        return results.length !== 0;
    }
    async existingUserFolder(user,permission){

        let project = await this.getProject(permission.projectId);
        let userFolderName = user.firstname+" "+user.lastname+"'s Uploads";
        let userFolder = this.makeFolder(project.id,project.name,userFolderName,'System',user.id);
        let exist = await this.folderExists(project.id,userFolderName);
        console.log(exist);
        if(!exist) {
            permission.folderPermissions.push({
                folderId: userFolder.id,
                folderName: userFolder.name,
                view: true,
                download: true
            });
            project.folders.push(userFolder);
            await this.Projects.updateOne({id: project.id}, {$set: {folders: project.folders}});
        }
        return permission;
    }
    async addFile(folder,file){
        let fileRecord = this.makeFile(folder.id,folder.name,file.name,file.author,file.size,file.ext,file.mime);
        return await this.Projects.updateOne({"id":folder.projectId,"folders.id":folder.id},{"$push":{"folders.$.files":fileRecord}});
    }
    async renameProject(projectid,newname){
        let project = await this.getProject(projectid);
        let update = await this.Projects.updateOne({id:projectid},{$set:{name:newname}});
        if(update.nModified === 1){
            update = project;
        }
        return update;
    }
    /**async renameFolder(projectid,folderid,newname){
        let folder = await this.getFolder(projectid,folderid);
        let update = await this.Projects.updateOne({'folders.id':folderid},{$set:{'folders.$.name':newname}});
        return folder;
    }**/
    async deleteFolder(projectid,folderid){
        return await this.Projects.updateOne({id:projectid},{$pull:{folders:{id:folderid}}});
    }
    async deleteProject(projectid){
        return await this.Projects.deleteOne({id:projectid});
    }
    async deleteFile(projectid,folderid,filename){
        return await this.Projects.updateOne({id:projectid,"folders.id":folderid},{$pull:{"folders.$.files":{name:filename}}});
    }
    make(name,author){
        let projectId = uuid();
        let folders = [];
        this.defaultFolders.forEach(folder=>{
            folders.push(this.makeFolder(projectId,name,folder,author,false));
        });
        return new this.Projects({id:projectId,name:name,folders:folders});
    }
    makeFile(folderid,foldername,fileName,author,size,ext,mime){
        return {
            id:uuid(),
            folderId:folderid,
            folderName:foldername,
            name:fileName,
            metadata:{
                author: author,
                created: new Date(),
                modified: '',
                accessed: '',
                size: size,
                ext:ext,
                mime:mime
            }
        }
    }
    makeFolder(projectId,projectName,name,author,userId){
        let userFolder = 'System';

        if(userId){
            userFolder = userId;
        }

        return{
            id:uuid(),
            projectId:projectId,
            projectName:projectName,
            name:name,
            parent:projectId,
            files:[],
            metadata:{
                author:author,
                created:new Date(),
                modified:'',
                accessed:'',
                userFolder:userFolder
            }
        };
    }
    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(action,values){

        this.observers.map(observer => observer.notify(action,values));

    }
}
module.exports={ProjectsRepo:ProjectsRepo};