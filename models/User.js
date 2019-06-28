class User{

    constructor(id,admin,firstname,lastname,email,password,authCode){
        this.id = id;
        this.admin = admin;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.authCode = authCode;
    }

}
module.exports = {User : User};