const Entity = require('./Entity').Entity;
const File = require('./File').File;
const Folder = require('./Folder').Folder;

class Entity_Factory {

    constructor() {
    }

    make(id,projectId,dir,name,author,isFolder) {

        return new Entity(id,projectId,dir,name,author,isFolder);

    }


}
module.exports={Entity_Factory:Entity_Factory};