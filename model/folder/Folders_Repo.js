const Folder = require('./Folder').Folder;
const File = require('./File').File;


const Date_Util = require('../../util/Date_Util').Date_Util;
const uuid = require('uuid');
const path = require('path');
const mimeTypes = require('mime-types');
const fs = require('fs.promises');

class Folders_Repo {

    constructor(){
        this.folders = [];
        this.dateUtil = new Date_Util();
        this.observers=[];
    }

    createFolder(name,admin,users){

        if(this.countDuplicateName(name) > 0){
            let duplicateCount = this.countDuplicateName(name);
            name = name +"("+duplicateCount+")";
        }
        return fs.mkdir('./storage/'+name).then((res)=>{

            const folderId = uuid();
            const folder = new Folder(folderId, name, this.dateUtil.getCurrentDate(), '', '', [], admin, users);
            this.folders.push(folder);

            this.notifyAll('folders', 'CREATE', folder);
            return folder;

        }).catch((err)=>{

            return err;


        });


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



    }

    deleteFolder(searchField,searchValue) {

        const folder = this.getFolder(searchField,searchValue);

        return fs.rmdir('./storage/'+folder.name).then((res)=>{
            for(let i = 0; i < this.folders.length; i++) {
                let curFolder = this.folders[i];
                if(curFolder[searchField] === searchValue) {
                    this.folders.splice(i,1);
                    this.notifyAll('folders', 'DELETE', {name: folder.name});
                    return folder;
                }
            }

        }).catch((err)=>{
            return err;
        });

    }
    addFile(foldername,name,data,directory,users){

        const folder = this.getFolder('name',foldername);


        const fileId = uuid();
        const size = Buffer.byteLength(data);
        const ext = path.extname(name);
        const mime = mimeTypes.lookup(ext);
        const file = new File(fileId, name, this.dateUtil.getCurrentDate(), '', '', ext, mime, size, directory, users);

        return fs.appendFile(directory+name, data, 'base64').then((result) => {

                folder.files.push(file);
                this.notifyAll('folders','UPDATE',[{name:foldername},{$set:folder}]);
                return file;

        }).catch((err)=>{
                return err;
        });


    }

    getFile(folderid,searchField,searchValue) {

        let success = false;

        if(this.getFolder('id',folderid)){

            const folder = this.getFolder('id',folderid);

            for(let i = 0; i < folder.files.length; i++){

                let curFile = folder.files[i];

                if(curFile[searchField] === searchValue){
                    success = curFile;
                }
            }
        }
        return success;
    }



    deleteFile(foldername,searchField,searchValue) {

        const folder = this.getFolder('name',foldername);
        const file = this.getFile(folder.id,searchField,searchValue);

        return fs.unlink(file.directory + file.name).then((res)=>{

            for(let i = 0; i < folder.files.length; i++){

                let curFile = folder.files[i];

                if(curFile[searchField] === searchValue){
                    folder.files.splice(i,1);
                    this.notifyAll('folders','UPDATE',[{name:folder.name},{$set:folder}]);
                    return file;
                }
            }

        }).catch((err)=>{
            throw err;
        });

    }
    countDuplicateName(name){

        let duplicates = 0;

        for(let i = 0; i < this.folders.length; i++) {

            let curFolder = this.folders[i];

            if (curFolder.name.includes(name)) {
                duplicates++;
            }
        }

        return duplicates;
    }
    load(folders){
        for(let i = 0; i < folders.length; i++){
            this.folders.push(
                new Folder(folders[i].id,
                    folders[i].name,
                    folders[i].created,
                    folders[i].modified,
                    folders[i].accessed,
                    folders[i].files,
                    folders[i].admin,
                    folders[i].users
                )
            )
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