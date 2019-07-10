
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
    viewFolder(user,name){

        let folderPermission = false;
        console.log('in view folder');
        if(this.verifyUser(user)){

            const folder = this.userRepo.getFolderPermission(user.email,name);
            console.log(folder);
            if(folder.read === true){
                console.log('has read');
                folderPermission = folder;

            }
        }
        return folderPermission;
    }
    uploadToFolder(user,name){

        let folderPermission = false;

        if(this.viewFolder(user,name)){

            let folder = this.viewFolder(user,name);

            if(this.user.admin === true||folder.write === true){

                folderPermission = folder;

            }

        }

        return folderPermission;
    }
    deleteFolder(user,folderName){

        let success = false;

        if(this.verifyUser(user)){

            if(this.uploadToFolder(user,folderName)){

                success = this.userRepo.deleteFolder(folderName);

            }

        }

        return success;
    }
    renameFolder(user,currentName,newName){
        let success = false;
        if(this.verifyUser(user)){
            if(this.uploadToFolder(user,currentName)){
                success = this.userRepo.renameFolder(currentName,newName);
            }
        }
        return success;

    }
    renameFile(user,folder,currentName,newName){

        let success = false;
        if(this.verifyUser(user)){
            console.log('verifed');
            if(this.uploadToFolder(user,folder)){
                console.log('has write priv');
                success = this.userRepo.renameFile(folder,currentName,newName);
            }
        }
        return success;

    }
    addNewFile(user,folderName,fileName,data,users){

        let success = false;

        if(this.verifyUser(user)){
            
            if(this.uploadToFolder(user,folderName)){

                success = this.userRepo.addNewFile(folderName,fileName,data,users);
            }
        }
        return success;
    }

    viewFile(user,folderName,fileName){

        let filePermission = false;

        if(this.verifyUser(user)){

            const file = this.userRepo.getFilePermission(user.email,folderName,fileName);

            if(file.read === true){

                filePermission = file;

            }
        }
        return filePermission;

    }
    deleteFile(user,folderName,fileName){

        let success = false;
        console.log('inside delete file');
        console.log(this.verifyUser(user));
        if(this.verifyUser(user)){

            console.log('verified');

            if(this.uploadToFolder(user,folderName)){

                console.log('folder access');

                success = this.userRepo.deleteFile(folderName,fileName);

            }
        }

        return success;
    }
    verifyUser(user){

        return this.user.id === user.id;
    }

}



module.exports={User_Action:User_Action};
