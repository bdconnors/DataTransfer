const Folder = require('./models/Folder').Folder;
const Files_Repo = require('./Files_Repo').Files_Repo;


const Date_Util = require('./util/Date_Util').Date_Util;
const uuid = require('uuid');
const path = require('path');
const mimeTypes = require('mime-types');


class Folders_Repo {

    constructor(){
        this.folders = [];
        this.dateUtil = new Date_Util();
        this.observers=[];
    }

    createFolder(name,admin,users){

        let success = false;

        const folderId = uuid();
        const folder = new Folder(folderId,name,this.dateUtil.getCurrentDate(),'','',[],admin,users,[]);
        this.folders.push(folder);

        if(this.getFolder('id',folderId)){
            success = this.getFolder('id',folderId);
            this.notifyAll('folders','CREATE',folder);
        }

        return success;

    }

    getFolder(searchField,searchValue) {

        let folder = false;

        for (let i = 0; i < this.folders.length; i++) {
            let curFolder = this.folders[i];
            if (curFolder[searchField] === searchValue) {
                folder = curFolder;
            }
        }

        return folder;

    }


    updateFolder(updateValue) {

        let success = false;

        if(this.getFolder('id',updateValue.id)){

            let folder = this.getFolder('id',updateValue.id);

            folder.id = updateValue.id;
            folder.name = updateValue.name;
            folder.created = updateValue.created;
            folder.modified = updateValue.modified;
            folder.accessed = updateValue.accessed;
            folder.files = updateValue.files;
            folder.admin = updateValue.admin;
            folder.users = updateValue.users;
            folder.activity = updateValue.activity;

             if(this.getFolder('id',updateValue.id)){
                 success = this.getFolder('id',updateValue.id);
                 this.notifyAll('folders','UPDATE',[{id:updateValue.id},{$set:updateValue}]);
             }


        }

        return success;


    }

    deleteFolder(searchField,searchValue) {

        let success = false;

        for(let i = 0; i < this.folders.length; i ++){

            let curFolder = this.folders[i];

            if(curFolder[searchField] === searchValue){
                success = curFolder;
                this.folders.splice(i,1);
                this.notifyAll('DELETE',curFolder);
            }
        }

        return success;
    }
    addFile(folderid,name,size,directory,admin,users){

        let success = false;

        if(this.getFolder('id',folderid)){

            const folder = this.getFolder('id',folderid);
            const fileRepo = new Files_Repo(folder.files);

            if(fileRepo.create(name,size,directory,users)){
                success = fileRepo.getFile('name',name);
                this.notifyAll('folders','UPDATE',[{id:folder.id},{$set:folder}]);
            }
        }

        return success;
    }

    getFile(folderid,searchField,searchValue) {

        let success = false;

        if(this.getFolder('id',folderid)){

            const folder = this.getFolder('id',folderid);
            const fileRepo = new Files_Repo(folder.files);

            if(fileRepo.getFile(searchField,searchValue)){
                success = fileRepo.getFile(searchField,searchValue);
            }
        }
        return success;
    }


    updateFile(folderid,searchField,searchValue,newFileValue) {

        let success = false;

        if(this.getFile(folderid,searchField,searchValue)){

            let folder = this.getFolder('id',folderid);
            const fileRepo = new Files_Repo(folder.files);

            if(fileRepo.updateFile(newFileValue)){

                success = newFileValue;
                this.notifyAll('folders','UPDATE',[{id:folder.id},{$set:folder}]);

            }
        }

        return success;
    }

    deleteFile(folderid,searchField,searchValue) {

       let success = false;

       if(this.getFile(folderid,searchField,searchValue)) {

           const folder = this.getFolder('id',folderid);
           const fileRepo = new Files_Repo(folder.files);
           const file = this.getFile(folderid,searchField,searchValue);

           if(fileRepo.deleteFile(searchField,searchValue)){
               success = file;
               this.notifyAll('folders','UPDATE',[{id:folder.id},{$set:folder}])
           }
       }
       return success;
    }

    subscribe(observer) {

        this.observers.push(observer)
    }

    notifyAll(collection,action,folder) {
        this.observers.map(observer => observer.notify(collection,action,folder));
    }

}
module.exports = {Folders_Repo:Folders_Repo};