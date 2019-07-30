const fs = require('fs');
const rimraf = require('rimraf');
const fileTypes = require('mime-types');
const uuid = require('uuid');

class File_System{

    constructor(){
        this.observers=[];
    }

    performAction(authResponse) {

        let vars = authResponse.variables.storage;
        if(vars.action === 'CREATE PROJECT'){
            this.createNewProject(authResponse);
        }else if(vars.action === 'NEW USER FOLDER'){
            this.createNewUserFolder(authResponse);
        }else if(vars.action === 'EXISTING USER FOLDER') {
            this.createExistingUserFolder(authResponse);
        }else if(vars.action === 'NEW PROJECT FOLDER'){
            this.createNewProjectFolder(authResponse);
        }else if(vars.action === 'WRITE FILE'){
            this.writeFile(authResponse);
        }else if(vars.action === 'STREAM FILE'){
            this.streamFile(authResponse);
        }else if(vars.action ==='DELETE FOLDER'){
            this.deleteFolder(authResponse);
        }else if(vars.action ==='DELETE PROJECT'){
            this.deleteProject(authResponse);
        }else if(vars.action ==='DELETE FILE'){
            this.deleteFile(authResponse);
        }else if(vars.action ==='RENAME PROJECT'){
            this.renameProject(authResponse);
        }



    }
    renameProject(authResponse){
        let project = authResponse.variables.storage.project;
        let oldpath = process.env.STORAGE_PATH+project.name;
        let newpath = process.env.STORAGE_PATH+authResponse.variables.storage.newName;
        fs.renameSync(oldpath,newpath);
        authResponse.response.send('/dashboard');
    }
    deleteFile(authResponse){
        let folder = authResponse.variables.storage.folder;
        let fileName = authResponse.variables.storage.file;
        let path = folder.projectName+'/'+folder.name+'/'+fileName;
        fs.unlinkSync(process.env.STORAGE_PATH+path);
        authResponse.command = 'REDIRECT';
        authResponse.display='/projects/project/'+folder.projectId+'/folders/folder/'+folder.id;
        this.notifyAll(authResponse);
    }
    deleteProject(authResponse){
        let project = authResponse.variables.storage.project;
        let path = project.name;
        rimraf.sync(process.env.STORAGE_PATH+path);
        authResponse.command ='REDIRECT';
        authResponse.display='/dashboard';
        this.notifyAll(authResponse);
    }
    deleteFolder(authResponse){
        let folder = authResponse.variables.storage.folder;
        let path = folder.projectName+'/'+folder.name;
        rimraf.sync(process.env.STORAGE_PATH+path);
        authResponse.command='REDIRECT';
        authResponse.display='/projects/project/'+folder.projectId;
        this.notifyAll(authResponse);

    }
    streamFile(authResponse){
        let path = authResponse.variables.storage.path;
        let file =  authResponse.variables.storage.file;
        let disposition = authResponse.variables.storage.disposition;
        let stream = fs.createReadStream(process.env.STORAGE_PATH+path);
        console.log(path);
        console.log(file);
        stream.on('open',()=>{
            authResponse.response.setHeader('Content-Disposition',disposition+'; filename='+file);
            stream.pipe(authResponse.response);
        });
    }
    writeFile(authResponse){
        let path = authResponse.variables.storage.path;
        let data = authResponse.variables.storage.data;
        fs.writeFileSync(process.env.STORAGE_PATH+path,data,{encoding:'base64'});
    }
    createNewProject(authResponse) {
        let project = authResponse.variables.storage.project;
        let projectPath = process.env.STORAGE_PATH+project.name;
        fs.mkdirSync(projectPath);
        project.folders.forEach(folder=>{
            fs.mkdirSync(projectPath+'/'+folder.name);
        });
        authResponse.response.send(project);
    }
    createNewUserFolder(authResponse){

        let folder = authResponse.variables.storage.folder;
        fs.mkdirSync(process.env.STORAGE_PATH+'/'+folder.projectName+'/'+folder.name);
    }
    createExistingUserFolder(authResponse){
        let permission = authResponse.variables.storage.permissions;
        let user = authResponse.variables.storage.user;
        let folderName = user.firstname+" "+user.lastname+"'s Uploads";
        fs.mkdirSync(process.env.STORAGE_PATH+permission.projectName+'/'+folderName);
    }
    createNewProjectFolder(authResponse){
        let project = authResponse.variables.storage.project;
        let newFolderPath = process.env.STORAGE_PATH+project.name+'/'+authResponse.variables.storage.foldername;
        fs.mkdirSync(newFolderPath);
    }
    notify(authResponse){
        if(authResponse.variables.storage){
            this.performAction(authResponse);
        }
    }
    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(authResponse){

        this.observers.map(observer => observer.notify(authResponse));

    }

}

module.exports = {File_System:File_System};