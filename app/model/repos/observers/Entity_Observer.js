class Entity_Observer{

    constructor(db){
        this.db = db;
    }
    create(query){

        return this.db.collection('entitys').insertOne(query).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        })

    }
    get(query){

        return this.db.collection('entitys').find(query).toArray().
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        })
    }
    update(query,update){

        return this.db.collection('entitys').updateOne(query,update).
        then((res)=>{

            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });

    }
    delete(query){

        return this.db.collection('entitys').removeOne(query).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });
    }
    createMany(queries){

        return this.db.collection('entitys').insertMany(queries).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        })

    }
    updateMany(query,update){

        return this.db.collection('entitys').updateMany(query,update).
        then((res)=>{

            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });

    }
    notify(action,value) {



    }
}

module.exports = {Entity_Observer};