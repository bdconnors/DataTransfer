const fs = require('fs');
const rimraf = require('rimraf');
const fileTypes = require('mime-types');
const uuid = require('uuid');

class File_System{

    constructor(){}

    performAction(authResponse) {

        let vars = authResponse.variables.storage;
        if(vars.action === 'CREATE PROJECT'){
            this.createNewProject(authResponse);
        }else if(vars.action === 'NEW USER FOLDERS'){
            this.createNewUserFolders(authResponse);
        }else if(vars.action === 'EXISTING USER FOLDER') {
            this.createExistingUserFolder(authResponse);
        }else if(vars.action === 'NEW PROJECT FOLDER'){
            this.createNewProjectFolder(authResponse);
        }



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
    createNewUserFolders(authResponse){
        let permissions = authResponse.variables.storage.permissions;
        let user = authResponse.variables.storage.user;
        permissions.forEach(permission=>{
            let folderName = user.firstname+" "+user.lastname+"'s "+permission.projectName+" Uploads";
            fs.mkdirSync(process.env.STORAGE_PATH+permission.projectName+'/'+folderName);
        });
    }
    createExistingUserFolder(authResponse){
        let permission = authResponse.variables.storage.permissions;
        let user = authResponse.variables.storage.user;
        let folderName = user.firstname+" "+user.lastname+"'s "+permission.projectName+" Uploads";
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


}

module.exports = {File_System:File_System};