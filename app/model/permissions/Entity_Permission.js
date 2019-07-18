const Project_Permission = require('./Project_Permission').Project_Permission;

class Entity_Permission extends Project_Permission{

    constructor(userId,projectId,entityId,view,edit,upload,download){
        super(userId,projectId,view,edit,upload,download);
        this.entityId = entityId;
    }

}
module.exports={Entity_Permission:Entity_Permission};