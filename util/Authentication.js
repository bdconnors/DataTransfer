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
        return user.folderwrite;
    }
    checkPassword(password, hash) {

        return bcrypt.compareSync(password, hash);

    }
    accountType(account){

        let permissions ={};

        if(account === 'Read Only') {

            permissions['admin'] = false;
            permissions['folderwrite'] = false;

        }else if(account === 'Read/Folder Creation'){

            permissions['admin'] = false;
            permissions['folderwrite'] = true;

        }else if(account === 'Administrator'){

            permissions['admin'] = true;
            permissions['folderwrite'] = true;

        }

        return permissions;
    }
    createHashPassword(plainText) {
        return bcrypt.hashSync(plainText, 10);
    }

}
module.exports = {Authentication:Authentication};