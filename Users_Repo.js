const User = require('./models/User').User;
const uuid = require('uuid');
const System_Mailer = require('./util/System_Mailer').System_Mailer;

class Users_Repo {

    constructor(){
        this.mailer = new System_Mailer('gmail','system.novitious@gmail.com','Rubix123');
        this.users = [];
        this.observers=[];
    }

    createUser(admin,firstname,lastname,email){

        let userid = uuid();
        let authCode = uuid();
        console.log('create: ' + authCode);
        let user = new User(userid,admin,firstname,lastname,email,'',authCode);
        this.users.push(user);
        return this.mailer.addUserEmail(firstname,email,authCode).then((res)=>{
            this.notifyAll('users','CREATE',user);
            return this.getUser('id',userid);
        }).catch((err)=>{
            console.log(err);
            return err;
        });

    }

    getUser(searchField,searchValue) {

        let user = false;

        for (let i = 0; i < this.users.length; i++) {
            let curUser = this.users[i];
            if (curUser[searchField] === searchValue) {
                user = curUser;
            }
        }

        return user;

    }

    getManyUsers(users){

        let manyUsers = [];

        for(let i = 0; i < users.length; i++){

            let curUser;

            if(this.getUser('id',users[i].id)){
                curUser = users[i];
                manyUsers[i] = curUser;
            }
        }

        return manyUsers;
    }
    updateUser(updateValue) {

        let success = false;

        if(this.getUser('id',updateValue.id)){
            let user = this.getUser('id',updateValue.id);
            user.id = updateValue.id;
            user.admin = updateValue.admin;
            user.firstname = updateValue.firstname;
            user.lastname = updateValue.lastname;
            user.email = updateValue.email;
            user.password = updateValue.password;
            user.authCode = updateValue.authCode;
            success = true;
            this.notifyAll('users','UPDATE',[{id:updateValue.id},{$set:updateValue}]);
        }

        return success;


    }

    deleteUser(searchField,searchValue) {

        let success = false;

        for(let i = 0; i < this.users.length; i ++){

            let curUser = this.users[i];

            if(curUser[searchField] === searchValue){
                success = curUser;
                this.notifyAll('users','DELETE',curUser);
                this.users.splice(i,1);
            }
        }

        return success;
    }
    load(users){

        for(let i = 0; i < users.length; i++){

            this.users[i] = new User(

                users[i].id,users[i].admin,users[i].firstname,users[i].lastname,
                users[i].email,users[i].password,users[i].authCode

            );
        }
    }

    subscribe(observer) {
        this.observers.push(observer)
    }

    notifyAll(collection,action,values) {
        this.observers.map(observer => observer.notify(collection,action,values));
    }

}
module.exports = {Users_Repo:Users_Repo};