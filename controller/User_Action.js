
const System_Mailer = require('../util/System_Mailer').System_Mailer;
const uuid = require('uuid');

class User_Action{

    constructor(userRepo,auth){
        this.userRepo = userRepo;
        this.auth = auth;
        this.user = null;
    }
    signIn(email,password){

        let success = false;

        if(this.userRepo.retrieve(email)){

            const user = this.userRepo.retrieve(email);

            if(this.auth.checkPassword(password,user.password)){

                    this.user = user;
                    success = true;

            }else{

                success = false;
            }

        }else{

            success = false;

        }

        return success;

    }
    createFolder(user,name,users){
        let success = false;

        if(this.verifyUser(user)){

            if(this.user.admin === true|| this.user.folderwrite === true) {
                success = this.userRepo.addNewFolder(users,name);
                console.log('create folder succes: '+success);
            }
        }

        return success;
    }
    inviteUser(user,firstname,lastname,email,permissions){

        let success = false;

        if(this.user.admin === true) {

            const id = uuid();
            const authCode = uuid();
            const admin = permissions.admin;
            const folderwrite = permissions.folderwrite;

            success = this.userRepo.create(id, admin, folderwrite, firstname, lastname, email, authCode);

        }

        return success;

    }
    verifyUser(user){

        return this.user.id === user.id;
    }
    hasUser(){
        return this.user;
    }

}



module.exports={User_Action:User_Action};
