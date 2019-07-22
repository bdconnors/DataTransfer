const bcrypt = require('bcrypt');

class UserController{

    constructor(model){
        this.model = model;
    }
    async getAllUsers() {
        return await this.model.getAll();
    }
    async verifyCredentials(email,password){
        console.log(password);
        console.log(email);
        return await this.model.get('email',email).then(user=>{
            if(bcrypt.compareSync(password,user[0].password)){
                return user;
            }else{
                return false;
            }
        }).catch(err=>{throw err});

    }
}
module.exports={UserController:UserController};