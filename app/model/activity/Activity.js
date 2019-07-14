const uuid = require('uuid');

class Activity{

    constructor(action,target){

        this.id = uuid();
        this.date = new Date();
        this.action = action;
        this.target = target;

    }

    getId(){ return this.id; }
    setId(id){ this.id = id; }

    getDate(){ return this.date; }
    setDate(date){ this.date = date; }

    getUserId(){ return this.user; }
    setUserId(user){ this.user = user; }

    getAction(){ return this.action; }
    setAction(action){ this.action = action; }

    getTarget(){ return this.target; }
    setTarget(target){ this.target = target; }


}
module.exports = {Activity:Activity};