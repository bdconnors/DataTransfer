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
            return this.db = mongo.db(this.dbName);
        }).
        catch((err)=>{
            return err;
        });
    }
    createDocuments(collection,queries){

        return this.db.collection(collection).insertMany(queries).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        })

    }
    retrieveDocuments(collection,query){

        return this.db.collection(collection).find(query).toArray().
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        })
    }
    updateDocuments(collection,querys,updates){

        return this.db.collection(collection).updateMany(querys,updates).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });

    }
    deleteDocuments(collection,deleteQuery){

        return this.conn.collection(collection).deleteMany(deleteQuery).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });
    }
}

module.exports = {Database:Database};