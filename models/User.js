class User{

    constructor(id,admin,firstname,lastname,email,password,folder){
        this.id = id;
        this.admin = admin;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.folder = folder;
    }

}
module.exports = {User : User};