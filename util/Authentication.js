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
    checkAdmin(req){
        return req.session.user.admin;
    }
    checkPassword(password, hash) {

        return bcrypt.compareSync(password, hash);

    }
    checkFolderPermission(folder,user){

        let permitted = false;
        const admin = folder.admin;
        const users = folder.users;

        if(user.id === folder.admin.id || user.admin === true){

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