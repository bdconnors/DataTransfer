const uuid = require('uuid');
class UsersRepo {

    constructor(Users){
        this.Users = Users;
    }

    async createUser(admin,firstname,lastname,email){
        console.log(lastname);
        let newUser = new this.Users({id:uuid(),admin:admin,firstname:firstname,lastname:lastname,email:email,authCode: uuid()});
        await newUser.save();
        return newUser;
    }
    async getUser(field,value){
        let results = await this.Users.find(this.makeQuery(field,value));
        if(results[0]){
            return results[0];
        }else{
            return false;
        }
    }
    async updateUser(field,value,updateQuery){
        return await this.Users.updateOne(this.makeQuery(field,value),updateQuery)
    }
    async deleteUser(field,value){

        return await this.Users.deleteOne(this.makeQuery(field,value));
    }
    async getAllUsers(){
        return await this.Users.find({});
    }
    makeQuery(field,value){
        let query = {};
        query[field] = value;
        console.log(query);
        return query;
    }

}
module.exports = {UsersRepo:UsersRepo};