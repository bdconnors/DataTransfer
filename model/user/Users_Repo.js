class Users_Repo {

    constructor(userFactory,folderFactory,storage,systemMailer){
        this.users = [];
        this.observers=[];
        this.userFactory = userFactory;
        this.folderFactory = folderFactory;
        this.storage = storage;
        this.systemMailer = systemMailer;
    }


    create(id,admin,folderwrite,firstname,lastname,email,authCode){

        let success = false;

        const user = this.userFactory.make(id,admin,folderwrite,firstname,lastname,email,'',[],authCode);

        if(this.systemMailer.invite(firstname,email,authCode)){

            this.users.push(user);
            success = true;
            this.notifyAll('users','CREATE',user);

        }else{

            success = false;

        }

        return success;

    }
    retrieve(email){

        let success = false;

        this.users.forEach((user)=>{

            if(user.email === email){
                success = user;
            }

        });
        return success;
    }
    retrieveBy(field,value){

        let success = false;

        this.users.forEach((user)=>{

            if(user[field] === value){
                success = user;
            }

        });
        return success;
    }
    retrieveMany(emails){

        let users = [];

        for(let i = 0; i < emails.length; i++){
            users.push(this.retrieve(emails[i]));
        }

        return users;

    }
    retrieveManyBy(field,values){

        let users = [];

        for(let i = 0; i < values.length; i++){
            users.push(this.retrieveBy(field,values[i]));
        }

        return users;
    }
    retrieveAdmins(){
        let users = [];

        this.users.forEach((user)=>{
            if(user.admin === true){
                users.push(user);
            }
        });

        return users;
    }
    updateMultipleFields(email,values){

        let success = false;

        for(let i = 0; i < this.users.length; i++){

            if(this.users[i].email === email){
                this.users[i] = values;
                success = values;
                this.notifyAll('users','UPDATE',this.users[i]);
            }

        }

        return success;

    }
    updateOneField(email,field,value){

        let success = false;

        for(let i = 0; i < this.users.length; i++){

            if(this.users[i].email === email){

                let olduser = this.users[i];
                let newuser = this.users[i][field] = value;

                this.notifyAll('users','UPDATE',[olduser,newuser]);
                success = newuser;
            }

        }

        return success;
    }

    delete(email){

        let success = false;

        for(let i = 0; i < this.users.length; i++){

            if(this.users[i].email === email){

                success = this.users[i];
                this.users.splice(i,1);
                this.notifyAll('users','DELETE',success);
            }
        }

        return success;
    }
    addNewFolder(users,name){

        let success = false;
        if(this.storage.createFolder(name)) {
            success = true;
            const admins = this.retrieveAdmins();

            admins.forEach((admin) => {

                admin.folders.push(this.folderFactory.make(name, true, true, [], '', '', ''));
                this.notifyAll('users', 'UPDATE', admin);

            });
            for (let i = 0; i < users.length; i++) {

                let curUser = this.retrieveBy('id', users[i].id);

                if (users[i].permission === 'read') {

                    curUser.folders.push(this.folderFactory.make(name, true, false, [], '', '', ''));
                    this.notifyAll('users', 'UPDATE', curUser);

                } else if (users[i].permission === 'write') {

                    curUser.folders.push(this.folderFactory.make(name, true, true, [], '', '', ''));
                    this.notifyAll('users', 'UPDATE', curUser);

                }
            }
            console.log('user repo success 1: '+success);
        }
        console.log('user repo success 2: '+success);
        return success;

    }
    load(users){

        users.forEach((user)=>{
            this.users.push(this.userFactory.convert(user));
        });

    }
    subscribe(observer) {
        this.observers.push(observer)
    }

    notifyAll(collection,action,values) {
        this.observers.map(observer => observer.notify(collection,action,values));
    }

}
module.exports = {Users_Repo:Users_Repo};