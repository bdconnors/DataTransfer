const Activity = require('./Activity').Activity;

class Activity_Factory{

    constructor(){
    }

    make(action,target){

        return new Activity(action,target);
    }

    convert(obj){

        return new Activity(obj.id,obj.date,obj.action,obj.target);

    }
}
module.exports = {Activity_Factory:Activity_Factory};