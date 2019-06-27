class Users_DB{

    constructor(database){
        this.db = database;

    }
    getAllUsers(){
        return this.db.retrieveDocuments('users',{}).
        then((res)=>{
            return res;
        }).
        catch((err)=>{
            return err;
        });
    }
    createUser(user){

        return this.db.createDocuments('users',[user]).
        then((res)=>{
            return res
        }).
        catch((err)=>{
            return err;
        });
    }
    retrieveUser(id){
        return this.db.retrieveDocuments('users',[{id:id}]).
        toArray().then((res)=>{
            return res[0]
        }).catch((err)=>{
            return err
        });
    }
    updateUser(user){

        return this.db.updateDocuments('users',[{id:user.id}],[{$set:user}]).
        then((res)=>{
            return res;
        }).
        catch((err)=>{
            return err;
        });
    }
    deleteUser(user){

        return this.db.deleteDocuments('users',[{id:user.id}]).
        then((res)=>{
            return res;
        }).
        catch((err)=>{
            return err;
        });

    }


    notify(action,user) {

        if(action === 'CREATE') {
            return this.createUser(user).then((res) => {
                return res;
            }).catch((err) => {
                return err;
            });
        }

        else if(action === 'UPDATE'){
            return this.updateUser(user).then((res)=>{
                return res;
            }).catch((err)=>{
               return err;
            });
        }

        else if( action === 'DELETE'){
            return this.deleteUser(user).
            then((res)=>{
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

module.exports = {Users_DB:Users_DB};