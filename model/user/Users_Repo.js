const User = require('./User').User;
const uuid = require('uuid');

class Users_Repo {

    constructor(userFactory){
        this.users = [];
        this.observers=[];
        this.userFactory = userFactory;
    }


    create(id,admin,folderwrite,firstname,lastname,email,authCode){

        let success = false;

        const user = this.userFactory.make(id,admin,folderwrite,firstname,lastname,email,'',[],authCode);
        this.users.push(user);

        if(this.retrieve(email)){
            success = true;
            this.notifyAll('users','CREATE',user);
        }

        return success;

    }
    retrieve(email){

        let success = false;

        this.users.forEach((user)=>{

            if(user.email === email){
                success = user;
            }

        });
        return success;
    }
    retrieveBy(field,value){

        let success = false;

        this.users.forEach((user)=>{

            if(user[field] === value){
                success = user;
            }

        });
        return success;
    }
    updateMultipleFields(email,values){

        let success = false;

        for(let i = 0; i < this.users.length; i++){

            if(this.users[i].email === email){
                this.users[i] = values;
                success = values;
                this.notifyAll('users','UPDATE',this.users[i]);
            }

        }

        return success;

    }
    updateOneField(email,field,value){

        let success = false;

        for(let i = 0; i < this.users.length; i++){

            if(this.users[i].email === email){

                let olduser = this.users[i];
                let newuser = this.users[i][field] = value;

                this.notifyAll('users','UPDATE',[olduser,newuser]);
                success = newuser;
            }

        }

        return success;
    }
    delete(email){

        let success = false;

        for(let i = 0; i < this.users.length; i++){

            if(this.users[i].email === email){

                success = this.users[i];
                this.users.splice(i,1);
                this.notifyAll('users','DELETE',success);
            }
        }

        return success;
    }
    load(users){
        users.forEach((user)=>{
            this.users.push(this.userFactory.convert(user));
        });

    }
    subscribe(observer) {
        this.observers.push(observer)
    }

    notifyAll(collection,action,values) {
        this.observers.map(observer => observer.notify(collection,action,values));
    }

}
module.exports = {Users_Repo:Users_Repo};