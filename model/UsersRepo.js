const uuid = require('uuid');
class UsersRepo {

    constructor(Users){
        this.Users = Users;
    }

    async createUser(firstname,lastname,email,projectPermissions){
        let newUser = new this.Users({id:uuid(),admin:false,firstname:firstname,lastname:lastname,email:email,projectPermissions:projectPermissions,authCode: uuid()});
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
        let update = await this.Users.updateOne(this.makeQuery(field,value),updateQuery);
        if(update.nModified === 1){
            console.log('inside update.nModified === 1');
            update = await this.getUser('id',value);
        }
        return update;
    }
    async deleteUser(field,value){

        return await this.Users.deleteOne(this.makeQuery(field,value));
    }
    async removeProjectPermission(userid,projectid){
        return await this.Users.updateOne({id:userid},{ $pull: { 'projectPermissions':{projectId:projectid}}});
    }
    async getAllUsers(){
        let users = await this.Users.find({admin:false});
        return users;
    }
    async getProjectUsers(id){
        return await this.Users.find({"projectPermissions.projectId":id});
    }
    makeQuery(field,value){
        let query = {};
        query[field] = value;
        return query;
    }
}
module.exports = {UsersRepo:UsersRepo};