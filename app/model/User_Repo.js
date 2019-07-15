const uuid = require('uuid');

class User_Repo {

    constructor(userFactory,projectFactory,entityFactory,storage){
        this.users = [];
        this.userFactory = userFactory;
        this.projectFactory = projectFactory;
        this.entityFactory = entityFactory;
        this.storage = storage;
        this.observers = [];
    }

    createUser(createdBy,admin,firstname,lastname,email){

        let success = false;
        let accountType;

        accountType = admin === 'true';

        let newUser = this.userFactory.make(accountType,firstname,lastname,email);
        newUser.addAuthCode();

        this.users.push(newUser);

        if(this.getUser(email)){

            let creator = this.getUser(createdBy);

            success = {admin:creator.getFullName(),activity:activity};

            this.notifyAll('UPDATE USER',creator);
            this.notifyAll('CREATE USER',newUser);

        }

        return success;

    }

    getUser(email){

        let success = false;

        this.users.forEach((user)=>{

            if(user.getEmail().toUpperCase() === email.toUpperCase()){
               success = user;
            }

        });

        return success;

    }
    getUserBy(field,value){

        let success = false;

        this.users.forEach((user)=>{

            if(user[field] === value){
                success = user;
            }
        });

        return success;

    }
    getProjectUsers(projectId,currentUserId){

        let users = [];

        this.users.forEach((user)=>{
            user.projects.forEach((project)=>{
                if(project.id === projectId && user.id !== currentUserId){
                    users.push(user);
                }
            });
        });

        return users;
    }
    deleteUser(email){

        let success = false;

        for(let i = 0; i < this.users.length; i++){

            if(this.users[i].email === email){

                success = this.users[i];
                this.users.splice(i,1);
                this.notifyAll('DELETE USER',success);
            }

        }

        return success;

    }
    
    verifyUser(email,password){

        let success = false;

        if(this.getUser(email)){

            let user = this.getUser(email);
            success = user.verifyPassword(password);
        }

        return success;
    }
    newUserUpdate(authCode,phone,password){

        let success = false;

        if(this.getUserBy('authCode',authCode)) {

            success = this.getUserBy('authCode',authCode);
            success.setPhone(phone);
            success.setHashPassword(password);
            success.deleteAuthCode();
            this.notifyAll('DELETE FIELD',[success,'authCode']);
            this.notifyAll('UPDATE USER',success)
        }


        return success;
    }
    addFolder(author,project,name,userPermissions,dir){

        let folderId = uuid();
        let admins = this.getAdmins();
        this.notifyAll('CREATE FOLDER',dir+'/'+name);
        admins.forEach((admin)=>{
            let projectPermission = admin.retrieveProject(project);
            let folderPermission = this.entityFactory.make(folderId,name,author.id,true,true,true,dir);
            folderPermission.getCreated();
            projectPermission.entitys.push(folderPermission);
            this.notifyAll('UPDATE USER',admin);
        });

        userPermissions.forEach((user)=>{
            let accountInfo = this.getUserBy('id',user.id);
            let projectPermission = accountInfo.retrieveProject(project);

            let read;
            let write;
            if(user.permission === 'write'){

                read = true;
                write = false;

            }else if(user.permission === 'read'){

                read = true;
                write = true;

            }

            let folderPermission = this.entityFactory.make(folderId,name,author,read,write,true,dir);
            folderPermission.getCreated();
            projectPermission.entitys.push(folderPermission);
            this.notifyAll('UPDATE USER',accountInfo);

        });

    }
    uploadFile(project,author,data,name,userPermissions,dir){
        console.log(data);
        let dataBuffer = Buffer.from(data,'base64');
        this.notifyAll('UPLOAD FILE',{dir:dir+'/'+name,data:dataBuffer});
        let admins = this.getAdmins();
        let fileId = uuid();

        admins.forEach((admin)=>{

            let proj = admin.retrieveProject(project);
            let filePermission = this.entityFactory.make(fileId,name,author,true,true,false,dir);
            filePermission.getCreated();
            filePermission.getExt();
            filePermission.getMime();
            proj.entitys.push(filePermission);
            this.notifyAll('UPDATE USER',admin);

        });

        userPermissions.forEach((user)=>{

            let userAccount = this.getUserBy('id',user.id);
            let proj = userAccount.retrieveProject(project);

            let read;
            let write;
            if(user.permission === 'write'){

                read = true;
                write = false;

            }else if(user.permission === 'read'){

                read = true;
                write = true;

            }

            let filePermission = this.entityFactory.make(fileId,name,author,read,write,false,dir);
            filePermission.getCreated();
            filePermission.getExt();
            filePermission.getMime();
            proj.entitys.push(filePermission);
            this.notifyAll('UPDATE USER',userAccount);

        });

    }
    addNewProject(name,userPermissions){

        let projectId = uuid();
        console.log('Id in add new proj: '+projectId);
        let admins = this.getAdmins();

        this.notifyAll('CREATE PROJECT',name);

        admins.forEach((admin)=>{

            admin.projects.push(this.projectFactory.make(projectId,name,true,true));
            this.notifyAll('UPDATE USER',admin);

        });

        userPermissions.forEach((user)=>{

           let userAccount = this.getUserBy('id',user.id);

           let read;
           let write;
           if(user.permission === 'write'){

               read = true;
               write = false;

           }else if(user.permission === 'read'){

               read = true;
               write = true;

           }

           let projectPermission = this.projectFactory.make(projectId,name,read,write);

           userAccount.addProject(projectPermission);
           this.notifyAll('UPDATE USER',userAccount);

        });

    }

    getAdmins(){

        let admins =[];

        this.users.forEach((user)=>{

            if(user.admin === true){

                admins.push(user);

            }

        });

        return admins;
    }

    load(users) {

        users.forEach((user) => {
            this.users.push(this.userFactory.convert(user));
        });

    }

    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(action,values){

        this.observers.map(observer => observer.notify(action,values));

    }



}
module.exports = {User_Repo:User_Repo};