const User = require('./User').User;

class User_Factory{

    constructor(folderFactory){
        this.folderFactory = folderFactory;
    }

    make(id,admin,folderwrite,firstname,lastname,email,password,folders,authCode){
        return new User(id,admin,folderwrite,firstname,lastname,email,password,folders,authCode);
    }
    convert(object){
        let folders = [];
        object.folders.forEach((folder)=>{
            folders.push(this.folderFactory.convert(folder));
        });
        return new User(
            object.id,
            object.admin,
            object.folderwrite,
            object.firstname,
            object.lastname,
            object.email,
            object.password,
            folders,
            object.authCode
        );
    }

}
module.exports={User_Factory:User_Factory};