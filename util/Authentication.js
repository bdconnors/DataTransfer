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


    createHashPassword(plainText) {
        return bcrypt.hashSync(plainText, 10);
    }

    authenticate(password,hash){
        return bcrypt.compareSync(password,hash);
    }
}
module.exports = {Authentication:Authentication};