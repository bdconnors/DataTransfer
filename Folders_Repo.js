const Folder = require('./models/Folder').Folder;
const Date_Util = require('./util/Date_Util').Date_Util;
const uuid = require('uuid');


class Folders_Repo {

    constructor(filesRepo){
        this.filesRepo = filesRepo;
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
            success = true;
        }

        this.notifyAll('folders','CREATE',folder);
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

            success = true;

            this.notifyAll('folders','UPDATE',updateValue);
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
    load(folders){

        for(let i = 0; i < folders.length; i++){

            this.folders[i] = new Folder(

                folders[i].id,
                folders[i].name,
                folders[i].created,
                folders[i].modified,
                folders[i].accessed,
                folders[i].files,
                folders[i].admin,
                folders[i].activity

            );
            console.log(this.folders);
        }
    }
    subscribe(observer) {

        this.observers.push(observer)
    }

    notifyAll(collection,action,folder) {
        this.observers.map(observer => observer.notify(collection,action,folder));
    }

}
module.exports = {Folders_Repo:Folders_Repo};