const User = require('./models/User').User;
const Folder = require('./models/Folder').Folder;
const Date_Util = require('./util/Date_Util').Date_Util;
const uuid = require('uuid');


class Folders_Repo {

    constructor(){
        this.folders = [];
        this.dateUtil = new Date_Util();
        this.observers=[];
    }

    createFolder(name,admin,users){

        let success = false;

        const folderId = uuid();
        const folder = new Folder(uuid,name,this.dateUtil.getCurrentDate(),'','',[],admin,users,[]);
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

            success = true;
            this.notifyAll('UPDATE',updateValue);
        }

        return success;


    }

    deleteFolder(searchField,searchValue) {

        let success = false;

        for(let i = 0; i < this.folders.length; i ++){

            let curFolder = this.folders[i];

            if(curFolder[searchField] === searchValue){
                success = curFolder;
                this.notifyAll('DELETE',curFolder);
                this.folders.splice(i,1);
            }
        }

        return success;
    }
    load(folders){

        for(let i = 0; i < folders.length; i++){

            this.folders[i] = new Folder(

                folders[i].id,folders[i].name,folders[i].created,folders[i].accessed,
                folders[i].modified,folders[i].files,folders[i].admin,folders[i].activity

            );
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