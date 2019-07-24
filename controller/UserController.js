const bcrypt = require('bcrypt');

class UserController{

    constructor(model){
        this.model = model;
    }

    async getUser(field,value){
        return await this.model.getUser(field,value).catch((err)=>{throw err});

    }
    async inviteNewUser(admin,firstname,lastname,email){
        console.log(lastname);
        return await this.model.createUser(admin,firstname,lastname,email);

    }
    async newUserUpdate(authCode,password,phone){
        let user = await this.model.getUser('authCode',authCode);
        let hashPass = await bcrypt.hash(password,10);
        return this.model.updateUser('id',user.id,{$unset:{authCode:''}})
            .then(this.model.updateUser('id',user.id,{$set:{password:hashPass,phone:phone}}))
            .then(()=>{return this.model.getUser('id',user.id)})
            .catch((err)=>{throw err});
    }
    async getAllUsers() {
        return await this.model.getAllUsers();
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