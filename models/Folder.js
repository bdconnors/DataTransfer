class Folder {

    constructor(id,name,created,modified,accessed,files,admin,users,activity){
        this.id = id;
        this.name = name;
        this.created = created;
        this.modified = modified;
        this.accessed = accessed;
        this.files = files;
        this.admin = admin;
        this.users = users;
        this.activity = activity;
    }
}

module.exports = {Folder:Folder};