class Project_Observer{

    constructor(db){
        this.db = db;
    }
    create(query){

        return this.db.collection('projects').insertOne(query).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        })

    }
    get(query){

        return this.db.collection('projects').find(query).toArray().
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        })
    }
    update(query,update){

        return this.db.collection('projects').updateOne(query,update).
        then((res)=>{

            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });

    }
    delete(query){

        return this.db.collection('projects').removeOne(query).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });
    }
    createMany(queries){

        return this.db.collection('projects').insertMany(queries).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        })

    }
    updateMany(query,update){

        return this.db.collection('projects').updateMany(query,update).
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

module.exports = {Project_Observer:Project_Observer};