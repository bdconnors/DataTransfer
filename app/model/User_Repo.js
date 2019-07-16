const uuid = require('uuid');

class User_Repo {

    constructor(userFactory,projectFactory,entityFactory){
        this.users = [];
        this.userFactory = userFactory;
        this.projectFactory = projectFactory;
        this.entityFactory = entityFactory;
        this.observers = [];
    }

    createUser(admin,firstname,lastname,email){

        let accountType;

        accountType = admin === 'true';

        let user = this.userFactory.make(accountType,firstname,lastname,email);
        user.addAuthCode();

        this.users.push(user);

        this.notifyAll('CREATE USER',user);

        return user;

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
    getProjectUsers(projectId){

        let users = [];

        this.users.forEach((user)=>{
            user.projects.forEach((project)=>{
                if(project.id === projectId){
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
            if(user.permission === 'read'){

                read = true;
                write = false;

            }else if(user.permission === 'write'){

                read = true;
                write = true;

            }

            let folderPermission = this.entityFactory.make(folderId,name,author,read,write,true,dir);
            folderPermission.getCreated();
            projectPermission.entitys.push(folderPermission);
            this.notifyAll('UPDATE USER',accountInfo);

        });
        return this.getEntityUsers(project,folderId);

    }
    renameFolder(project,folder,newName){

        this.notifyAll('RENAME FOLDER',{olddir:project.name+'/'+folder.name,newdir:project.name+'/'+newName});
        let users = this.getProjectUsers(project.id);

        users.forEach(user=>{

            let projectPermission = user.retrieveProject(project.id);
            let folderPermission = projectPermission.retrieveEntity(folder.id);
            folderPermission.setName(newName);

            this.notifyAll('UPDATE USER',user);

        });
        return this.getProjectUsers(project.id);

    }
    uploadFile(project,author,data,name,userPermissions,dir){

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
            if(user.permission === 'read'){

                read = true;
                write = false;

            }else if(user.permission === 'write'){

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
        return this.getEntityUsers(project,fileId);

    }
    deleteFolder(project,folder){

        this.users.forEach((user)=>{
            user.projects.forEach((proj)=>{
                if(proj.id === project.id){

                    for(let i = 0; i < proj.entitys.length; i++){
                        if(proj.entitys[i].id === folder.id){

                            proj.entitys.splice(i,1);

                            this.notifyAll('DELETE FOLDER',folder.dir+'/'+folder.name);
                            this.notifyAll('UPDATE USER',user);
                        }
                    }
                }
            });
        });

    }
    deleteFile(project,file){
        this.users.forEach((user)=>{
            user.projects.forEach((proj)=>{
                if(proj.id === project.id){

                    for(let i = 0; i < proj.entitys.length; i++){
                        if(proj.entitys[i].id === file.id){

                            proj.entitys.splice(i,1);
                            this.notifyAll('DELETE FILE',file.dir+'/'+file.name);
                            this.notifyAll('UPDATE USER',user);
                        }
                    }
                }
            });
        });
    }
    addNewProject(name,userPermissions){

        let projectId = uuid();

        let clinFolderId = uuid();
        let regAffFolderId = uuid();
        let ipFolderId = uuid();
        let markAnalyFolderId = uuid();
        let busDevFolderId = uuid();
        let miscFolderId = uuid();

        let admins = this.getAdmins();

        this.notifyAll('CREATE PROJECT',name);

        admins.forEach((admin)=>{

            let project = this.projectFactory.make(projectId,name,true,true);

            project.addEntity(this.entityFactory.make(ipFolderId,'Intellectual Property','System',true,true,true,name));
            project.addEntity(this.entityFactory.make(regAffFolderId,'Regulatory Affairs','System',true,true,true,name));
            project.addEntity(this.entityFactory.make(clinFolderId,'Clinical Information','System',true,true,true,name));
            project.addEntity(this.entityFactory.make(markAnalyFolderId,'Market Analysis','System',true,true,true,name));
            project.addEntity(this.entityFactory.make(busDevFolderId,'Business Development','System',true,true,true,name));
            project.addEntity(this.entityFactory.make(miscFolderId,'Misc','System',true,true,true,name));

            admin.projects.push(project);
            this.notifyAll('UPDATE USER',admin);

        });

        userPermissions.forEach((user)=>{

           let userAccount = this.getUserBy('id',user.id);

           let read;
           let write;
           if(user.permission === 'read'){

               read = true;
               write = false;

           }else if(user.permission === 'write'){

               read = true;
               write = true;

           }

           let projectPermission = this.projectFactory.make(projectId,name,read,write);

            projectPermission.addEntity(this.entityFactory.make(ipFolderId,'Intellectual Property','System',read,write,true,name));
            projectPermission.addEntity(this.entityFactory.make(regAffFolderId,'Regulatory Affairs','System',read,write,true,name));
            projectPermission.addEntity(this.entityFactory.make(clinFolderId,'Clinical Information','System',read,write,true,name));
            projectPermission.addEntity(this.entityFactory.make(markAnalyFolderId,'Market Analysis','System',read,write,true,name));
            projectPermission.addEntity(this.entityFactory.make(busDevFolderId,'Business Development','System',read,write,true,name));
            projectPermission.addEntity(this.entityFactory.make(miscFolderId,'Misc','System',read,write,true,name));

           userAccount.addProject(projectPermission);
           this.notifyAll('UPDATE USER',userAccount);

        });
        return this.getProjectUsers(projectId);

    }
    updateProjectPermissions(project,permissions){
        console.log(permissions);
        permissions.forEach(permission =>{

            let user = this.getUserBy('id',permission.id);
            let userProjectPermission;
            let read;
            let write;

            if (permission.permission === 'read') {
                read = true;
                write = false;
            } else if (permission.permission === 'write') {
                read = true;
                write = true;
            }

            if(user.retrieveProject(project.id)) {

                userProjectPermission = user.retrieveProject(project.id);

                if (permission.permission === 'delete') {

                    user.deleteProject(project.id);
                    this.notifyAll('UPDATE USER', user);

                } else {

                    userProjectPermission.setRead(read);
                    userProjectPermission.setWrite(write);
                    this.notifyAll('UPDATE USER', user);
                }

            }else{

                userProjectPermission = this.projectFactory.make(project.id,project.name,read,write);
                user.addProject(userProjectPermission);
                this.notifyAll('UPDATE USER', user);

            }

        });

        return this.getProjectUsers(project.id);

    }
    deleteProject(project){

        let projectUsers = this.getProjectUsers(project.id);

        projectUsers.forEach((user)=>{
           user.deleteProject(project.id);
           this.notifyAll('UPDATE USER',user);
        });
        this.notifyAll('DELETE PROJECT',project.name);
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
    getEntityUsers(projectid,id){

        let folderUsers = [];
        let projectUsers = this.getProjectUsers(projectid);
        projectUsers.forEach(user=>{
            user.projects.forEach(project=>{
                project.entitys.forEach(entity=>{
                    if(entity.id === id){
                        folderUsers.push(user);
                    }
                })
            })
        });
        return folderUsers;
    }

    userIntegrityCheck(user){

        return this.userFactory.convert(user);
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