class Users_Repo {

    constructor(userFactory,folderFactory,fileFactory,storage,systemMailer){
        this.users = [];
        this.observers=[];
        this.userFactory = userFactory;
        this.folderFactory = folderFactory;
        this.fileFactory = fileFactory;
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

            if(user.email.toUpperCase() === email.toUpperCase()){

                if(this.storageIntegrityCheck(user)){

                    this.notifyAll('users','UPDATE',user);

                }

                success = user;
            }

        });
        return success;
    }
    retrieveBy(field,value){

        let success = false;

        this.users.forEach((user)=>{

            if(user[field].toUpperCase()=== value.toUpperCase()){
                success = user;
            }

        });
        return success;
    }
    retrieveMany(emails){

        let users = [];

        for(let i = 0; i < emails.length; i++){

            let user = this.retrieve(emails[i]);

            if(this.storageIntegrityCheck(user)){

                this.notifyAll('users','UPDATE',user);

            }

            users.push(user);
        }

        return users;

    }
    retrieveManyBy(field,values){

        let users = [];

        for(let i = 0; i < values.length; i++){

            let user = this.retrieveBy(field,values[i]);

            if(this.storageIntegrityCheck(user)){
                this.notifyAll('users','UPDATE',user);
            }

            users.push(user);
        }

        return users;
    }
    retrieveAdmins(){
        let users = [];

        this.users.forEach((user)=>{
            if(user.admin === true){
                if(this.storageIntegrityCheck(user)){
                    this.notifyAll('users','UPDATE',user);
                }
                users.push(user);
            }
        });

        return users;
    }
    updateMultipleFields(email,values){

        let success = false;

        for(let i = 0; i < this.users.length; i++){

            if(this.users[i].email.toUpperCase() === email.toUpperCase()){
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

            if(this.users[i].email.toUpperCase() === email.toUpperCase()){

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

            if(this.users[i].email.toUpperCase() === email.toUpperCase()){

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

        }

        return success;

    }
    addNewFile(folderName,fileName,data,users){

        let success = false;
        if(this.storage.createFile(folderName,fileName,data)) {
            success = true;
            const admins = this.retrieveAdmins();

            admins.forEach((admin) => {
                let folderPermission = this.getFolderPermission(admin.email,folderName);
                folderPermission.files.push(this.fileFactory.make(fileName,true,true,'','',''));
                this.notifyAll('users', 'UPDATE', admin);

            });
            for (let i = 0; i < users.length; i++) {

                let curUser = this.retrieveBy('id', users[i].id);
                let folderPermission = this.getFolderPermission(curUser.email,folderName);

                if (users[i].permission === 'read') {

                    folderPermission.files.push(this.fileFactory.make(fileName, true, false, '', '', ''));
                    this.notifyAll('users', 'UPDATE', curUser);

                } else if (users[i].permission === 'write') {

                    folderPermission.files.push(this.fileFactory.make(fileName, true, true, '', '', ''));
                    this.notifyAll('users', 'UPDATE', curUser);

                }
            }

        }

        return success;



    }
    getFilePermission(email,foldername,filename){

        let file = false;

        let user = this.retrieve(email);

        if(this.storageIntegrityCheck(user)){

            this.notifyAll('users','UPDATE',user);

        }

        for(let i =0 ; i < user.folders.length; i++){
            let curFolder = user.folders[i];
            if(curFolder.name.toUpperCase() === foldername.toUpperCase()){

                for(let i = 0; i < curFolder.files.length; i++){

                    let curFile = curFolder.files[i];

                    if(curFile.name.toUpperCase() === filename.toUpperCase()){
                        file = curFile;
                    }
                }

            }

        }

        return file;

    }
    getFolderPermission(email,folderName){

        let folder = false;

        let user = this.retrieve(email);

        if(this.storageIntegrityCheck(user)){

            this.notifyAll('users','UPDATE',user);

        }

        for(let i =0 ; i < user.folders.length; i++){

            if(user.folders[i].name.toUpperCase() === folderName.toUpperCase()){

                folder = user.folders[i];

            }

        }

        return folder;
    }
    load(users){

        users.forEach((user)=>{

            let userObj = this.userFactory.convert(user);

            if(this.storageIntegrityCheck(userObj)){
                this.notifyAll('users','UPDATE',userObj);
            }

            this.users.push(userObj);

        });

    }

    storageIntegrityCheck(user){

        let discrepancy = false;

        for(let i = 0; i < user.folders.length; i++){

            let curFolder = user.folders[i];

            if(!this.storage.checkFolder(curFolder.name)){
                user.folders.splice(i,1);
                discrepancy = true;

            }else{

                for(let i = 0; i < curFolder.files.length; i++){

                    let curFile = curFolder.files[i];

                    if(!this.storage.checkFile(curFolder.name,curFile.name)){
                        curFolder.files.splice(i,1);
                        discrepancy = true;
                    }
                }

            }
        }
        return discrepancy;
    }
    deleteFolder(name){

        let success = false;

        if(this.storage.deleteFolder(name)) {

            this.users.forEach((user) => {

                if (this.getFolderPermission(user.email, name)) {

                    for (let i = 0; i < user.folders.length; i++) {

                        if (user.folders[i].name.toUpperCase() === name.toUpperCase()) {

                            user.folders.splice(i, 1);
                        }
                    }

                    this.notifyAll('users','UPDATE',user);
                }

            });

            success = true;

        }

        return success;
    }
    deleteFile(folder,file){

        let success = false;

        if(this.storage.deleteFile(folder,file)) {

            this.users.forEach((user) => {

                if (this.getFolderPermission(user.email, folder)) {

                    for (let i = 0; i < user.folders.length; i++) {

                        let curFolder = user.folders[i];

                        if (curFolder.name.toUpperCase() === folder.toUpperCase()) {

                            for(let i = 0; i < curFolder.files.length; i++){

                                let curFile = curFolder.files[i];

                                if(curFile.name === file){

                                    curFolder.files.splice(i,1);

                                    this.notifyAll('users','UPDATE',user);
                                }
                            }
                        }
                    }

                }

            });

            success = true;

        }

        return success;
    }
    renameFolder(currentName,newName){

        let success = false;

        if(this.storage.renameFolder(currentName,newName)){

            this.users.forEach((user)=>{
                if(this.getFolderPermission(user.email,currentName)){
                    let folder = this.getFolderPermission(user.email,currentName);
                    folder.name = newName;
                    this.notifyAll('users','UPDATE',user);
                }
            });
            success = true;
        }

        return success;

    }
    renameFile(folderName,currentName,newName){

        let success = false;

        if(this.storage.renameFile(folderName,currentName,newName)){
            console.log('file renamed');
            this.users.forEach((user)=>{

                for(let i = 0; i < user.folders.length; i++) {

                    let curFolder = user.folders[i];

                    if (curFolder.name.toUpperCase() === folderName.toUpperCase()) {

                        curFolder.files.forEach((file) => {

                            if (file.name.toUpperCase() === currentName.toUpperCase()) {

                                file.name = newName;
                                this.notifyAll('users', 'UPDATE', user);

                            }


                        });
                    }
                }

                });

            success = true;
        }

        return success;

    }
    subscribe(observer) {
        this.observers.push(observer)
    }

    notifyAll(collection,action,values) {
        this.observers.map(observer => observer.notify(collection,action,values));
    }

}
module.exports = {Users_Repo:Users_Repo};