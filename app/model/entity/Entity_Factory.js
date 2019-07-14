const Entity = require('./Entity').Entity;
const File = require('./File').File;
const Folder = require('./Folder').Folder;

class Entity_Factory {

    constructor(){}

    make(dir,name,author,read,write,isFolder){

        return new Entity(dir,name,author,read,write,isFolder);

    }
    convert(obj){

        let entity;

        if(obj.isFolder){

            entity = new Folder(obj.dir,obj.name,obj.author,obj.read,obj.write);

            obj.files.forEach((file)=>{
                    entity.addFile(this.convert(file));
            });

        }else{

            entity = new File(obj.dir,obj.name,obj.author,obj.read,obj.write);
            entity.getExt();
            entity.getMime();

        }

        entity.setId(obj.id);
        entity.getSize();
        entity.getCreated();
        entity.getModified();
        entity.getAccessed();

        return entity;
    }
}
module.exports={Entity_Factory:Entity_Factory};