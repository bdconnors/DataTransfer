class File_Permission{

    constructor(name,read,write,created,modified,accessed){
        this.name = name;
        this.read = read;
        this.write = write;
        this.created = created;
        this.modified = modified;
        this.accessed = accessed;
    }

}
module.exports = {File_Permission:File_Permission};