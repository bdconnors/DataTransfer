const bcrypt = require('bcrypt');

class UserController{

    constructor(model){
        this.model = model;
    }

    async getUser(field,value){
        return await this.model.getUser(field,value).catch((err)=>{throw err});

    }
    async inviteNewUser(firstname,lastname,email,projectPermissions){
        return await this.model.createUser(firstname,lastname,email,projectPermissions);

    }
    async updateUser(field,value,updateQuery){
        return await this.model.updateUser(field,value,updateQuery);
    }
    async updateNewUser(authCode,phone,password){
        let user = await this.model.getUser('authCode',authCode);
        let hashPass = await bcrypt.hash(password,10);
        return this.model.updateUser('id',user.id,{$unset:{authCode:''}})
            .then(this.model.updateUser('id',user.id,{$set:{password:hashPass,phone:phone}}))
            .then(()=>{return this.model.getUser('id',user.id)})
            .catch((err)=>{throw err});
    }
    async addProjectPermission(userid,permission){
        console.log('inside user control');
        console.log(userid);
        console.log(permission);
        let response =  await this.model.addProjectPermission(userid,permission);
        console.log(response);
        return response;

    }
    async getAllUsers() {
        return await this.model.getAllUsers();
    }
    async getProjectUsers(id){
        return await this.model.getProjectUsers(id);
    }
    async removeProjectPermission(userid,projectid){
        return await this.model.removeProjectPermission(userid,projectid);
    }
    async verifyCredentials(email,password){
        return await this.model.getUser('email',email)
            .then(user => {
                if(bcrypt.compareSync(password,user.password)){
                    return user;
                }else{
                    return false;
                }
            })
            .catch(()=>{return false});
    }
}
module.exports={UserController:UserController};