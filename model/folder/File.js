class File{
    constructor(id,name,created,modified,accessed,ext,mime,size,directory,users){
        this.id = id;
        this.name = name;
        this.created = created;
        this.modified = modified;
        this.accessed = accessed;
        this.ext = ext;
        this.mime = mime;
        this.size = size;
        this.directory = directory;
        this.users = users;
    }
}
module.exports = {File:File};