const Project = require('./Project').Project;

class Project_Factory {

    constructor(entityFactory){
        this.entityFactory = entityFactory;
    }

    make(id,name,read,write){

        return new Project(id,name,read,write);

    }
    convert(obj){

        let project = new Project(obj.id,obj.name,obj.read,obj.write);

        obj.entitys.forEach((entity)=>{

            project.addEntity(this.entityFactory.convert(entity));

        });

        return project;

    }
}
module.exports={Project_Factory:Project_Factory};