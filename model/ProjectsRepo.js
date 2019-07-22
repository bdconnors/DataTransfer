const uuid = require('uuid');
class ProjectsRepo {

    constructor(Projects){
        this.Projects = Projects;
        this.observers = [];
    }
    async createProject(name){
        let newProject = new this.Projects({id:uuid(),name:name});
        return await newProject.save();
    }
    async getProject(id){
        return await this.Projects.get({id:id});
    }


    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(action,values){

        this.observers.map(observer => observer.notify(action,values));

    }
}
module.exports={ProjectsRepo:ProjectsRepo};