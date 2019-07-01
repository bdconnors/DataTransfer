class Activity{
    constructor(id,date,entity,user,action,message){
        this.id = id;
        this.date = date;
        this.entity = entity;
        this.user = user;
        this.action = action;
        this.message = message;
    }
}
module.exports={Activity:Activity};