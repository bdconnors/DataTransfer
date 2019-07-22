require('dotenv').config();

this.db = require('mongoose');
this.db.connect(process.env.DB_HOST,{useNewUrlParser:true});
module.exports.db = this.db;

let Schema = this.db.Schema;

let metaDataSchema = new Schema({
    author: String,
    created: String,
    modified: String,
    accessed: String,
    size: String,
    ext: String,
    mime: String
});

let entitySchema = new Schema({
    id: String,
    isFolder:Boolean,
    name: String,
    dir:String,
    parent: String,
    children:[String],
    metadata:metaDataSchema
});

let activitySchema = new Schema({
    id: String,
    date: String,
    action: String,
    target: String,
    targetType: String
});

let projectPermissionSchema = new Schema({
    id: String,
    projectId:String,
    view: Boolean,
    edit: Boolean,
    upload:Boolean
});


let entityPermissionSchema = new Schema({
    id: String,
    projectId:String,
    entityId:String,
    view: Boolean,
    edit: Boolean,
    download:Boolean,
    upload:Boolean,
});

let projectSchema = new Schema( {
    id: String,
    name: String,
    entities: [entitySchema]
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
    entityPermissions: [entityPermissionSchema],
    password: String,
    phone: String,
    authCode:String

});
let user = this.db.model('User',userSchema);
module.exports.User = user;