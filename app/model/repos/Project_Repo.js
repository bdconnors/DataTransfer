class Project_Repo {

    constructor(projectFactory){
        this.projectFactory = projectFactory;
        this.projects = [];
        this.observers = [];
    }
    getProject(id){

        let project = false;

        this.projects.forEach(proj=>{

            if(proj.id === id){
                project = proj;
            }
        });

        return project;
    }
    load(projects){
      projects.forEach(project=>{
          this.projects.push(this.convert(project));
      });
    }

    convert(obj){

        let project = this.projectFactory.make(obj.name);

        project.id = obj.id;

        obj.entitys.forEach(entity =>{
            project.addEntity(entity);
        });

        return project;

    }

    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(action,values){

        this.observers.map(observer => observer.notify(action,values));

    }
}
module.exports={Project_Repo:Project_Repo};