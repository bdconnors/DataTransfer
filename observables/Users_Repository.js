const User = require('../models/User').User;
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const uuid = require('uuid');

class Users_Repository {

    constructor(){
        this.users = [];
        this.observers=[];
    }


    load(){
        this.notifyAll('LOAD');
    }
    createUser(admin,firstname,lastname,email,password,folder){

        let userid = uuid();
        let hashPassword = this.createHashPassword(password);
        let user = new User(userid,admin,firstname,lastname,email,hashPassword,folder);
        this.users.push(user);
        this.notifyAll('CREATE',user);
        return this.getUserByID(userid);

    }

    getUserByEmail(email) {

        let user = false;
        console.log(this.users);
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].email === email) {
                user = this.users[i];
            }
        }

        return user;

    }

    getUserByID(id) {

        let user = false;
        console.log(this.users);
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                user = this.users[i];
            }
        }

        return user;

    }
    updateUser(id,field,value) {

        let user = this.getUserByID(id);
        user[field] = value;
        this.notifyAll('UPDATE',user);

    }

    deleteUser(id) {

        let success = false;

        for(let i = 0; i < this.users.length; i ++){
            if(this.users[i].id === id){
                success = this.users[i];
                this.notifyAll('DELETE',this.users[i]);
                this.users.splice(i,1);
            }
        }

        return success;
    }
    checkPassword(password, hash) {

        return bcrypt.compareSync(password, hash);

    }


    createHashPassword(plainText) {
        return bcrypt.hashSync(plainText, 10);
    }

    authenticate(password,hash){
        return bcrypt.compareSync(password,hash);
    }

    subscribe(observer) {
        this.observers.push(observer)
    }

    notifyAll(action,user) {
        this.observers.map(observer => observer.notify(action,user));
    }

}
module.exports = {Users_Repository:Users_Repository};