const User = require('./User').User;

class User_Factory{

    constructor(){}

    make(admin,firstname,lastname,email){
        return new User(admin,firstname,lastname,email);
    }


}
module.exports={User_Factory:User_Factory};