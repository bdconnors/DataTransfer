const Activity = require('./Activity').Activity;

class Activity_Factory{

    constructor(entityFactory){
        this.entityFactory = entityFactory;
    }

    make(userId,action,target){

        return new Activity(userId,action,target);
    }
    convert(obj){

        return new Activity(obj.id,obj.date,obj.userId,obj.action,this.entityFactory.convert(obj.target));

    }
}
module.exports = {Activity_Factory:Activity_Factory};