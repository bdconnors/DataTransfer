const Entity = require('./Entity').Entity;
const File = require('./File').File;
const Folder = require('./Folder').Folder;

class Entity_Factory {

    constructor(storage) {
        this.storage = storage;
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

            if (this.entityIntegrityCheck(obj)) {

                entity = new Folder(obj.id, obj.name, obj.author, obj.read, obj.write, obj.dir);

                obj.files.forEach(file =>{
                    if(this.entityIntegrityCheck(file)){
                        entity.addFile(this.convert(file));
                    }
                });
            }

        } else {

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

    folderIntegrityCheck(folder) {

        return this.storage.folderExists(folder.dir + '/' + folder.name);
    }

    fileIntegrityCheck(file) {
        return this.storage.fileExists(file.dir + '/' + file.name);
    }

    entityIntegrityCheck(entity) {

        let exists = false;

        if (entity.isFolder) {

            if (this.folderIntegrityCheck(entity)) {

                for (let i = 0; entity.files.length; i++) {

                    if (!this.entityIntegrityCheck(entity.files[i])) {

                        entity.files.splice(i, 1);

                    }
                }
                exists = true;
            }

        } else {

            exists = this.fileIntegrityCheck(entity);

        }

        return exists;
    }
}
module.exports={Entity_Factory:Entity_Factory};