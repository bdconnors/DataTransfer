const Project_Permission = require('./Project_Permission').Project_Permission;
const Entity_Permission = require('./Entity_Permission').Entity_Permission;

class Permission_Factory{
    constructor(){}

    make(userId,projectId,entityId,view,edit,upload,download){
        if(entityId) {
            return new Entity_Permission(userId,projectId,entityId,view,edit,upload,download);
        }else{
            return new Project_Permission(userId,projectId, view, edit, upload, download);
        }
    }

}
module.exports={Permission_Factory:Permission_Factory};