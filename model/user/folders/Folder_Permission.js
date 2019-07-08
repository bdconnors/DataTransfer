class Folder_Permission{

    constructor(name,read,write,files,created,modified,accessed){
        this.name = name;
        this.read = read;
        this.write = write;
        this.files = files;
        this.created = created;
        this.modified = modified;
        this.accessed = accessed;
    }

}
module.exports = {Folder_Permission:Folder_Permission};