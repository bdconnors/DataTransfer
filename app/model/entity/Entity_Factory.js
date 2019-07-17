const Entity = require('./Entity').Entity;
const File = require('./File').File;
const Folder = require('./Folder').Folder;

class Entity_Factory {

    constructor() {
    }

    make(id, name, author, read, write, isFolder, dir) {
        if (isFolder === true) {
            return new Folder(id, name, author, read, write, dir);
        } else {
            return new File(id, name, author, read, write, dir);
        }

    }

    convert(obj) {

        let entity;


        if (obj.isFolder) {

            entity = new Folder(obj.id, obj.name, obj.author, obj.read, obj.write, obj.dir);

            obj.files.forEach(file =>{

                entity.addFile(this.convert(file));

            });

        }else{

            entity = new File(obj.id, obj.name, obj.author, obj.read, obj.write, obj.dir);
            entity.getExt();
            entity.getMime();

        }

        entity.getSize();
        entity.getCreated();
        entity.getModified();
        entity.getAccessed();


        return entity;
    }

}
module.exports={Entity_Factory:Entity_Factory};