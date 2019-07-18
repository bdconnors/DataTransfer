class User_Observer{

    constructor(db){
        this.db = db;
    }
    create(query){

        return this.db.collection('users').insertOne(query).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        })

    }
    get(query){

        return this.db.collection('users').find(query).toArray().
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        })
    }
    update(query,update){

        return this.db.collection('users').updateOne(query,update).
        then((res)=>{

            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });

    }
    delete(query){

        return this.db.collection('users').removeOne(query).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });
    }
    createMany(queries){

        return this.db.collection('users').insertMany(queries).
        then((res)=>{
            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        })

    }
    updateMany(query,update){

        return this.db.collection('users').updateMany(query,update).
        then((res)=>{

            return JSON.parse(JSON.stringify(res));
        }).
        catch((err)=>{
            return JSON.parse(JSON.stringify(err));
        });

    }

    notify(action,value) {

        if(action === 'CREATE'){
            this.create(value);
        }else if(action === 'UPDATE'){
            this.update(value[0],value[1]);
        }else if(action === 'DELETE' ){
            this.delete(value);
        }

    }
}

module.exports = {User_Observer:User_Observer};