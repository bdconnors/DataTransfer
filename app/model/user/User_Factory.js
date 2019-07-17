const User = require('./User').User;

class User_Factory{

    constructor(projectFactory){

        this.projectFactory = projectFactory;

    }

    make(admin,firstname,lastname,email){
        return new User(admin,firstname,lastname,email);
    }
    convert(obj){

        let user = new User(obj.admin,obj.firstname,obj.lastname,obj.email);
        user.setId(obj.id);

        obj.projects.forEach(project => {
            user.projects.push(this.projectFactory.convert(project));
        });

        if(obj.authCode){

            user.setAuthCode(obj.authCode);
        }

        if(obj.phone){
            user.setPhone(obj.phone);
        }

        if(obj.password){
            user.setPassword(obj.password);
        }

        return user;
    }

}
module.exports={User_Factory:User_Factory};