const User_Permission = require('./User_Permission').User_Permission;

class Project_Permission extends User_Permission{

    constructor(userId,projectId,view,edit,upload,download){
        super(userId,view,edit,upload,download);
        this.projectId = projectId;
    }

}
module.exports={Project_Permission:Project_Permission};