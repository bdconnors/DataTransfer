class User_Controller{

    constructor(repo){
        this.repo = repo;
    }

    checkAccountCredentials(email,password){
        return this.repo.checkAccountCredentials(email,password);
    }
    inviteNewUser(admin,firstname,lastname,email){
        return this.repo.createUser(admin,firstname,lastname,email);
    }
    updateNewUser(user,phone,password){
        return this.repo.newUserUpdate(user,phone,password);
    }
    getUserBy(field,value){
        return this.repo.getUserBy(field,value);
    }
    getAllUsers(){
        return this.repo.users;
    }
    hasProjectPermission(user,projectid){
        return this.repo.getProjectPermission(user.id,projectid);
    }
    getProjectUsers(projectid){
        return this.repo.getProjectUsers(projectid);
    }
    getFolderUsers(folderid){
        return this.repo.getFolderUsers(folderid);
    }
    getFileUsers(fileid){
        return this.repo.getFileUsers(fileid);
    }

}
module.exports = {User_Controller:User_Controller};