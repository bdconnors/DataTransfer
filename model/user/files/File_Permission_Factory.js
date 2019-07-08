const File_Permission = require('./File_Permission').File_Permission;

class File_Permission_Factory{

    constructor(){}

    make(name,read,write,created,modified,accessed){
        return new File_Permission(name,read,write,created,modified,accessed);
    }
    convert(object){
        return new File_Permission(object.name,object.read,object.write,object.created,object.modified,object.accessed);
    }

}
module.exports = {File_Permission_Factory:File_Permission_Factory};