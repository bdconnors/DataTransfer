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
        let results = await this.Projects.find({id:id});
        return results[0];
    }
    async getAllProjects(){
        return await this.Projects.find({});
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