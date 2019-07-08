const Folder_Permission = require('./Folder_Permission').Folder_Permission;

class Folder_Permission_Factory{

    constructor(fileFactory){
        this.fileFactory = fileFactory;
    }

    make(name,read,write,files,created,modified,accessed){
        return new Folder_Permission(name,read,write,files,created,modified,accessed);
    }
    convert(object) {
        let files = [];

        object.files.forEach((file) => {
            files.push(this.fileFactory.convert(file));
        });

        return new Folder_Permission(
            object.name,
            object.read,
            object.write,
            files,
            object.created,
            object.modified,
            object.accessed
        );
    }
}
module.exports = {Folder_Permission_Factory:Folder_Permission_Factory};