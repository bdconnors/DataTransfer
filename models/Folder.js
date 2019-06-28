class Folder {

    constructor(id,name,created,accessed,modified,files,admin,users,activity){
        this.id = id;
        this.name = name;
        this.created = created;
        this.accessed = accessed;
        this.modified = modified;
        this.files = files;
        this.admin = admin;
        this.users = users;
        this.activity = activity;
    }
}

module.exports = {Folder:Folder};