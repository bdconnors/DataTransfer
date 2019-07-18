const uuid = require('uuid');
const bcrypt = require('bcrypt');

class User{

    constructor(admin,firstname,lastname,email){

        this.id = uuid();
        this.admin = admin;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.projectPermissions = [];
        this.entityPermissions = [];
        this.activity =[];

    }

    addProjectPermission(project){ this.projects.push(project); }

    getProjectPermission(id){

        let permission = false;

        this.projectPermissions.forEach((perm)=>{

            if(permission.id === id){
                permission = perm;
            }

        });

        return permission
    }

    updateProjectPermission(id,newPermission){


        let oldPermission = false;

        for(let i = 0; i < this.projectPermissions.length; i++){

            if(this.projectPermissions[i].id === id){

                oldPermission = this.projectPermissions[i];
                this.projectPermissions[i] = newPermission;
            }

        }

        return oldPermission;

    }
    deleteProjectPermission(id){

        let permission = false;

        for(let i= 0; i < this.projectPermissions.length; i++){

            if(this.projectPermissions[i] === id){

                permission = this.projectPermissions[i];
                this.projectPermissions.splice(i,1);

            }

        }

        return permission;
    }

    addEntityPermission(permission){ this.entityPermissions.push(permission); }

    getEntityPermission(id){

        let permission = false;

        this.entityPermissions.forEach((entityPermission)=>{

            if(entityPermission === id){
                permission = entityPermission;
            }

        });

        return permission;
    }

    updateEntityPermission(id,newPermission){


        let oldPermission = false;

        for(let i = 0; i < this.entityPermissions.length; i++){

            if(this.entityPermissions[i] === id){

                oldPermission = this.entityPermissions[i];
                this.entityPermissions[i] = newPermission;
            }

        }

        return oldPermission;

    }
    deleteEntityPermission(id){

        let permission = false;

        for(let i= 0; i < this.entityPermissions.length; i++){

            if(this.entityPermissions[i] === id){

                permission = this.entityPermissions[i];
                this.entityPermissions.splice(i,1);

            }

        }

        return permission;
    }


    addActivity(activity){ this.activity.push(activity); }

    retrieveActivity(id){

        let success = false;

        this.activity.forEach((activity)=>{

            if(activity === id){
                success = activity;
            }

        });

        return success;
    }

    updateActivity(id,newActivity){

        let oldActivity = false;

        for(let i = 0; i < this.activity.length; i++){

            if(this.activity[i] === id) {

                oldActivity = this.activity[i];
                this.activity[i] = newActivity;

            }

        }

        return oldActivity

    }

    deleteActivity(id){

        let activity = false;

        for(let i= 0; i < this.activity.length; i++){

            if(this.activity[i] === id){

                activity = this.activity[i];
                this.activity.splice(i,1);
            }

        }

        return activity;
    }

    addAuthCode(){this.authCode = uuid()}
    deleteAuthCode(){ delete this.authCode; }

}
module.exports = {User : User};