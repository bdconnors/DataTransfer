const bcrypt = require('bcrypt');

class Authentication{

    constructor(){}

    checkSession(req){
        let valid = false;
        if(req.session && req.session.user){
            valid = true;
        }
        return valid;
    }
    checkAdmin(user){
        return user.admin;
    }
    checkWritePriv(user){
        return user.write;
    }
    checkPassword(password, hash) {

        return bcrypt.compareSync(password, hash);

    }
    checkFolderPermission(folder,user){

        let permitted = false;
        const users = folder.users;

        if(this.checkFolderAdmin(folder,user)|| this.checkAdmin(user)){

            permitted = true;

        }else{

            for(let i = 0; i < users.length; i++){

                if(users[i].id === user.id){
                    permitted = true;
                }
            }

        }

        return permitted;
    }
    checkFolderAdmin(folder,user){

        let permitted = false;

        if(folder.admin.id === user.id){
            permitted = true;
        }

        return permitted;

    }
    checkFileAdmin(file,user){

        let permitted = false;

        if(file.admin.id === user.id){
            permitted = true;
        }

        return permitted;
    }
    checkFilePriv(file,user){

        let permitted = false;

        const users = file.users;

        if(this.checkAdmin(user)){

            permitted = true;

        }else{

            for(let i = 0; i < users.length; i++){

                if(users[i].id === user.id){

                    permitted = true;

                }
            }

        }

        return permitted;

    }
    createHashPassword(plainText) {
        return bcrypt.hashSync(plainText, 10);
    }

}
module.exports = {Authentication:Authentication};