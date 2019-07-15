const Project = require('./Project').Project;

class Project_Factory {

    constructor(entityFactory,storage){
        this.entityFactory = entityFactory;
        this.storage = storage;
    }

    make(id,name,read,write){
        console.log('Id in proj factory: '+id);
        return new Project(id,name,read,write);

    }
    convert(obj){

        let project = new Project(obj.id,obj.name,obj.read,obj.write,obj.dir);

        obj.entitys.forEach((entity)=>{

            if(this.entityIntegrityCheck(entity)) {
                project.addEntity(this.entityFactory.convert(entity));
            }

        });

        return project;

    }
    folderIntegrityCheck(folder){

        return this.storage.folderExists(folder.dir+'/'+folder.name);
    }
    fileIntegrityCheck(file){
        return this.storage.fileExists(file.dir+'/'+file.name);
    }
    entityIntegrityCheck(entity){

        let exists = false;

        if(entity.isFolder){

            if(this.folderIntegrityCheck(entity)){

                for(let i = 0; entity.files.length; i++){

                    if(!this.entityIntegrityCheck(entity.files[i])){

                        entity.files.splice(i,1);

                    }
                }
                exists = true;
            }

        }else{

            exists = this.fileIntegrityCheck(entity);

        }

        return exists;
    }

}
module.exports={Project_Factory:Project_Factory};