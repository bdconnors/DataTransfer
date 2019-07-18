const uuid = require('uuid');

class User_Repo {

    constructor(userFactory){
        this.users = [];
        this.userFactory = userFactory;
        this.observers = [];
    }

    createUser(admin,firstname,lastname,email){

        let user = this.userFactory.make(admin,firstname,lastname,email);
        user.addAuthCode();
        this.notifyAll('CREATE',{
            id:user.id,
            admin:admin,
            firstname:firstname,
            lastname:lastname,
            email:email,authCode:user.authCode
        });
        this.users.push(user);
        return user;

    }
    getUser(id){

        let user = false;

        this.users.forEach(userObj =>{

            if(userObj.id === id){

                user = userObj;

            }

        });

        return user;
    }
    getUserBy(field,value){

        let user = false;

        this.users.forEach(userObj =>{

            if(userObj[field] === value){

                user = userObj;

            }

        });

        return user;
    }
    updateUser(id,field,value){

        let user = this.getUser(id);

        if(value === 'projectPermissions'){
            user.addProjectPermission(value);
        }else if(value ==='entityPermission'){
            user.addEntityPermission(value)
        }else if(value === 'activity'){
            user.addActivity(value);
        }else{
            user[field] = value;
        }

        return user;

    }

    deleteUser(id){

        let user = false;
        for(let i = 0; i < this.users.length; i++){
            if(this.users[i].id === id) {
                user = this.users[i];
                this.users.splice(i, 1);
            }
        }
        return user;

    }

    load(users){
        users.forEach(user=>{
           this.users.push(this.convert(user));
        });
    }

    convert(obj){

        let user = this.userFactory.make(obj.admin,obj.firstname,obj.lastname,obj.email);

        user.id = obj.id;
        user.activity = obj.activity;
        if(obj.password){
            user.password = obj.password;
        }
        if(obj.phone){
            user.phone = obj.phone;
        }
        if(obj.authCode){
            user.authCode = obj.authCode;
        }
        obj.projectPermissions.forEach(permission=>{
            user.addProjectPermission(permission);
        });
        obj.entityPermissions.forEach(permission =>{
            user.addEntityPermission(permission);
        });

        return user;
    }

    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(action,values){

        this.observers.map(observer => observer.notify(action,values));

    }



}
module.exports = {User_Repo:User_Repo};