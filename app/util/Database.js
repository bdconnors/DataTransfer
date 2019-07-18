const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;

class Database{

    constructor(url,dbName){
        this.url = url;
        this.dbName = dbName;
    }
    connect(){
        return MongoClient.connect(this.url).
        then((mongo)=>{
            return mongo.db(this.dbName);
        }).
        catch((err)=>{
            return err;
        });
    }
}

module.exports = {Database:Database};