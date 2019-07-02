class File{
    constructor(id,name,created,modified,accessed,ext,mime,size,directory,admin,users){
        this.id = id;
        this.name = name;
        this.created = created;
        this.modified = modified;
        this.accessed = accessed;
        this.ext = ext;
        this.mime = mime;
        this.size = size;
        this.directory = directory;
        this.admin = admin;
        this.users = users;
    }
}
module.exports = {File:File};