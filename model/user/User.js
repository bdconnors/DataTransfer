class User{

    constructor(id,admin,folderwrite,firstname,lastname,email,password,folders,authCode){
        this.id = id;
        this.admin = admin;
        this.folderwrite = folderwrite;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.folders = folders;
        this.authCode = authCode;
    }

}
module.exports = {User : User};