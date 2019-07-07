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
    updateDocuments(collection,query,update){

        return this.db.collection(collection).updateMany(query,update).
        then((res)=>{

            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });

    }
    deleteDocuments(collection,deleteQuery){
        console.log(deleteQuery);
        return this.db.collection(collection).removeMany(deleteQuery).
        then((res)=>{
            console.log(res);
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });
    }

    notify(collection,action,value) {
        console.log(value);
        if(action === 'CREATE') {
            return this.createDocuments(collection,[value]).then((res) => {
                return res;
            }).catch((err) => {
                return err;
            });
        }

        else if(action === 'UPDATE'){
            return this.updateDocuments(collection,value[0],value[1]).then((res)=>{
                return res;
            }).catch((err)=>{
                return err;
            });
        }

        else if( action === 'DELETE'){
            return this.deleteDocuments(collection,value).
            then((res)=>{
                console.log('db delete');
                return res;
            }).
            catch((err)=>{
                return err;
            });
        }

        else{

            return false;
        }


    }
}

module.exports = {Database:Database};