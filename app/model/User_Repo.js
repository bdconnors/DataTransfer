const uuid = require('uuid');

class User_Repo {

    constructor(userFactory,projectFactory,entityFactory,activityFactory){
        this.users = [];
        this.userFactory = userFactory;
        this.projectFactory = projectFactory;
        this.entityFactory = entityFactory;
        this.activityFactory = activityFactory;
        this.observers = [];
    }

    createUser(createdBy,admin,firstname,lastname,email){

        let success = false;
        let accountType;

        accountType = admin === 'true';

        let newUser = this.userFactory.make(accountType,firstname,lastname,email);
        newUser.addAuthCode();

        this.users.push(newUser);

        if(this.getUser(email)){

            let creator = this.getUser(createdBy);
            let activity = this.activityFactory.make('invited',{

                    firstname:newUser.getFirstName(),
                    lastname:newUser.getLastName(),
                    email:newUser.getEmail(),
                    authCode:newUser.getAuthCode()

                }
            );
            success = {admin:creator.getFullName(),activity:activity};

            creator.activity.push(activity);
            this.notifyAll('UPDATE USER',creator);
            this.notifyAll('CREATE USER',newUser);

        }

        return success;

    }

    getUser(email){

        let success = false;

        this.users.forEach((user)=>{

            if(user.getEmail().toUpperCase() === email.toUpperCase()){
               success = user;
            }

        });

        return success;

    }
    getUserBy(field,value){

        let success = false;
        console.log(field);
        console.log(value);
        this.users.forEach((user)=>{
            console.log(user[field]);
            if(user[field] === value){
                success = user;
            }
        });

        return success;

    }

    deleteUser(email){

        let success = false;

        for(let i = 0; i < this.users.length; i++){

            if(this.users[i].email === email){

                success = this.users[i];
                this.users.splice(i,1);
                this.notifyAll('DELETE USER',success);
            }

        }

        return success;

    }
    
    verifyUser(email,password){

        let success = false;

        if(this.getUser(email)){

            let user = this.getUser(email);
            success = user.verifyPassword(password);
        }

        return success;
    }
    newUserUpdate(authCode,phone,password){

        let success = false;

        if(this.getUserBy('authCode',authCode)) {

            success = this.getUserBy('authCode',authCode);
            success.setPhone(phone);
            success.setHashPassword(password);
            success.deleteAuthCode();
            this.notifyAll('DELETE FIELD',[success,'authCode']);
            this.notifyAll('UPDATE USER',success)
        }

        return success;
    }
    addNewProject(name,userPermissions){

        let projectId = uuid();
        let admins = this.getAdmins();

        this.notifyAll('CREATE PROJECT',name);

        admins.forEach((admin)=>{

            admin.projects.push(this.projectFactory.make(projectId,name,true,true));
            this.notifyAll('UPDATE USER',admin);

        });

        userPermissions.forEach((user)=>{

           let userAccount = this.getUserBy('id',user.id);
           let read;
           let write;
            console.log(userAccount);
           if(user.permission === 'write'){

               read = true;
               write = false;

           }else if(user.permission === 'read'){

               read = true;
               write = true;

           }

           let projectPermission = this.projectFactory.make(projectId,name,read,write);

           userAccount.addNewProject(projectPermission);
           this.notifyAll('UPDATE USER',userAccount);

        });

    }

    getAdmins(){

        let admins =[];

        this.users.forEach((user)=>{

            if(user.admin === true){

                admins.push(user);

            }

        });

        return admins;
    }

    load(users) {

        users.forEach((user) => {
            this.users.push(this.userFactory.convert(user));
        });

    }

    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(action,values){

        this.observers.map(observer => observer.notify(action,values));

    }



}
module.exports = {User_Repo:User_Repo};