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
        return results.folders[0];

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
    async newUserFolders(firstname,lastname,permissions){
        for(let i = 0; i < permissions.length; i++){
            let curProjPerm = permissions[i];
            let project = await this.getProject(curProjPerm.projectId);
            let userFolderName = firstname+" "+lastname+"'s "+project.name+" Uploads";
            let userFolder = this.makeFolder(project.id,project.name,userFolderName,'System');
            curProjPerm.folderPermissions.push({folderId:userFolder.id,folderName:userFolder.name,view:true,download:true});
            project.folders.push(userFolder);
            await this.Projects.updateOne({id:project.id},{$set:{folders:project.folders}});
        }
        return permissions;

    }
    async existingUserFolder(firstname,lastname,permission){

        let project = await this.getProject(permission.projectId);
        let userFolderName = firstname+" "+lastname+"'s "+project.name+" Uploads";
        let userFolder = this.makeFolder(project.id,project.name,userFolderName,'System');
        permission.folderPermissions.push({folderId:userFolder.id,folderName:userFolder.name,view:true,download:true});
        project.folders.push(userFolder);
        await this.Projects.updateOne({id:project.id},{$set:{folders:project.folders}});
        return permission;
    }
    make(name,author){
        let projectId = uuid();
        let folders = [];
        this.defaultFolders.forEach(folder=>{
            folders.push(this.makeFolder(projectId,name,folder,author));
        });
        return new this.Projects({id:projectId,name:name,folders:folders});
    }
    makeFolder(projectId,projectName,name,author){
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
                accessed:''
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