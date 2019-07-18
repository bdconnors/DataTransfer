const bcrypt = require('bcrypt');

class User_Controller{

    constructor(repo){
        this.repo = repo;
    }

    checkAccountCredentials(email,password){
        let user = this.repo.getUserBy('email',email);
        if(bcrypt.compareSync(password,user.password)){
            return user;
        }else{
            return false;
        }
    }
    getUserBy(field,value){
        return this.repo.getUserBy(field,value);
    }
    getAllUsers(){
        return this.repo.users;
    }

    getProjectUsers(projectId){

        let projectUsers = [];

        this.repo.users.forEach(user=>{
            user.projectPermissions.forEach(permission =>{
                if(permission.projectId === projectId){
                    projectUsers.push(user);
                }
            });
        });

        return projectUsers;
    }

    getEntityUsers(entityId){

        let entityUsers = [];

        this.repo.users.forEach(user=>{
            user.entityPermissions.forEach(permission =>{
                if(permission.entityId === entityId){
                    entityUsers.push(user);
                }
            });
        });

        return entityUsers;

    }

}
module.exports = {User_Controller:User_Controller};