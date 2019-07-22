const uuid = require('uuid');
class UsersRepo {

    constructor(Users){
        this.Users = Users;
        this.observers = [];
    }

    async createUser(admin,firstname,lastname,email){
        let newUser = new this.Users({id:uuid(),admin:admin,firstname:firstname,lastnam:lastname,email:email});
        await newUser.save();
        return newUser;
    }
    async getUser(id){
        return await this.Users.find({id:id});
    }
    async updateUser(id,updateQuery){
        return await this.Users.updateOne({id:id},updateQuery)
    }
    async deleteUser(id){

        return await this.Users.deleteOne({id:id});
    }
    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(action,values){

        this.observers.map(observer => observer.notify(action,values));

    }

}
module.exports = {UsersRepo:UsersRepo};