require('dotenv').config();

this.db = require('mongoose');
this.db.connect(process.env.DB_HOST,{useNewUrlParser:true});
module.exports.db = this.db;

let Schema = this.db.Schema;

let projectSchema = new Schema( {
    id: String,
    name: String,
    folders: [{
        id: String,
        projectId:String,
        projectName:String,
        name: String,
        parent: String,
        files:[{
            id:String,
            folderId:String,
            folderName:String,
            name:String,
            metadata:{
                author: String,
                created: String,
                modified: String,
                accessed: String,
                size: String,
                ext:String,
                mime:String
            }
        }],
        metadata:{author:String,created: String,modified: String,accessed: String,size: String}
    }]
});

let Project = this.db.model('Project',projectSchema);
module.exports.Project = Project;

let userSchema = new Schema({
    id: String,
    admin: Boolean,
    firstname: String,
    lastname: String,
    email: String,
    activity: [{id: String,date:String,action:String,target:String,targetType:String}],
    projectPermissions: [{
        projectId:String,
        projectName:String,
        folderPermissions:[{folderId:String,folderName:String,view: Boolean,download: Boolean}]
    }],
    password: String,
    phone: String,
    authCode:String

});

userSchema.methods.getFullName = function(){
    return this.firstname+" "+this.lastname;
};

let user = this.db.model('User',userSchema);
module.exports.User = user;