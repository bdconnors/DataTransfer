const User = require('./User').User;
const uuid = require('uuid');
const System_Mailer = require('../../util/System_Mailer').System_Mailer;

class Users_Repo {

    constructor(){
        this.mailer = new System_Mailer('gmail','system.novitious@gmail.com','Rubix123');
        this.users = [];
        this.observers=[];
    }

    createUser(admin,write,firstname,lastname,email){

        let userid = uuid();
        let authCode = uuid();
        console.log('create: ' + authCode);
        let user = new User(userid,admin,write,firstname,lastname,email,'',authCode);
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

    getManyUsers(userIds){

        let manyUsers = [];

        for(let i = 0; i < userIds.length; i++){

            console.log('in ID for loop ');
            let curId = userIds[i];
            console.log(curId);

            if(this.getUser('id',curId) !== false){
                console.log('user exists');
                console.log(this.getUser('id',curId));
                manyUsers[i] = this.getUser('id',curId);
            }

        }
        console.log('many users');
        console.log(manyUsers);


        return manyUsers;
    }
    updateUser(updateValue) {

        let success = false;

        if(this.getUser('id',updateValue.id)!== false){
            let user = this.getUser('id',updateValue.id);
            user.id = updateValue.id;
            user.admin = updateValue.admin;
            user.write = updateValue.write;
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
            this.users.push(
                new User(users[i].id,
                    users[i].admin,
                    users[i].folderwrite,
                    users[i].firstname,
                    users[i].lastname,
                    users[i].email,
                    users[i].password,
                    users[i].authCode)
            )
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