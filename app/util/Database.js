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

        return this.db.collection(collection).removeMany(deleteQuery).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });
    }
    removeProperty(collection,query,update){

        return this.db.collection(collection).updateMany(query,update).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });
    }

    notify(action,value) {

        if(action === 'CREATE USER') {
            return this.createDocuments('users',[value]).then((res) => {
                return res;
            }).catch((err) => {
                return err;
            });
        }

        else if(action === 'UPDATE USER'){
            return this.updateDocuments('users',{email:value.email},{$set:value}).then((res)=>{
                return res;
            }).catch((err)=>{
                return err;
            });
        }

        else if( action === 'DELETE USER'){
            return this.deleteDocuments('users',{email:value.email}).
            then((res)=>{
                return res;
            }).
            catch((err)=>{
                return err;
            });
        }else if(action === 'DELETE FIELD'){

            let update = {};
            update[value[1]] = '';

            return this.removeProperty('users',{email:value[0].email},{$unset:update}).
            then((res)=>{
                return res;
            }).
            catch((err)=>{
                return err;
            });

        }else if(action === 'CREATE PROJECT'){


        }

    }
}

module.exports = {Database:Database};