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
        return await this.Projects.get({id:id});
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