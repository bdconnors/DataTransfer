require('dotenv').config();

this.db = require('mongoose');
this.db.connect(process.env.DB_HOST,{useNewUrlParser:true});
module.exports.db = this.db;

let Schema = this.db.Schema;

let folderMetaDataSchema = new Schema({
    author: String,
    created: String,
    modified: String,
    accessed: String,
    size: String
});

let fileMetaDataSchema = new Schema({
    author: String,
    created: String,
    modified: String,
    accessed: String,
    size: String,
    ext:String,
    mime:String
});

let activitySchema = new Schema({
    id: String,
    date: String,
    action: String,
    target: String,
    targetType: String
});

let fileSchema = new Schema({
    id:String,
    folderId:String,
    folderName:String,
    name:String,
    metadata:fileMetaDataSchema
});

let folderSchema = new Schema({
    id: String,
    projectId:String,
    projectName:String,
    name: String,
    parent: String,
    files:[fileSchema],
    metadata:folderMetaDataSchema
});


let folderPermissionSchema = new Schema({
    folderId:String,
    folderName:String,
    view: Boolean,
    download: Boolean
});

let projectPermissionSchema = new Schema({
    projectId:String,
    projectName:String,
    folderPermissions:[folderPermissionSchema]
});

let projectSchema = new Schema( {
    id: String,
    name: String,
    folders: [folderSchema]
});

let Project = this.db.model('Project',projectSchema);
module.exports.Project = Project;

let userSchema = new Schema({
    id: String,
    admin: Boolean,
    firstname: String,
    lastname: String,
    email: String,
    activity: [activitySchema],
    projectPermissions: [projectPermissionSchema],
    password: String,
    phone: String,
    authCode:String

});

userSchema.methods.getFullName = function(){
    return this.firstname+" "+this.lastname;
};

let user = this.db.model('User',userSchema);
module.exports.User = user;