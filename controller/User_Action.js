const File_System = require('../File_System').File_System;
const System_Mailer = require('../util/System_Mailer').System_Mailer;
const uuid = require('uuid');

class User_Action{

    constructor(user,userRepo,storage){
        this.user = user;
        this.userRepo = userRepo;
        this.storage = storage;
        this.mailer = new System_Mailer('gmail','system.novitious@gmail.com','Rubix123');
    }
    inviteUser(firstname,lastname,email,permissions){

        let success = false;

        if(this.user.admin === true) {

            const id = uuid();
            const authCode = uuid();
            const admin = permissions.admin;
            const folderwrite = permissions.folderwrite;
            console.log('user is admin');
            if (this.userRepo.create(id, admin, folderwrite, firstname, lastname, email, authCode)) {
                console.log('user repo create success');
                if (this.mailer.invite(firstname, email, authCode)) {
                    console.log('mail sent success');
                    success = true;
                }
            }

        }

        return success;

    }

}



module.exports={User_Action:User_Action};
