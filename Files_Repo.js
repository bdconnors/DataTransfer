const File = require('./models/File').File;
const Date_Util = require('./util/Date_Util').Date_Util;
const uuid = require('uuid');
const path = require('path');
const mimeTypes = require('mime-types');


class Files_Repo {

    constructor(files){
        this.files = files;
        this.dateUtil = new Date_Util();
    }

    createFile(name,size,directory,admin,users){

        let success = false;

        const fileId = uuid();
        const ext = path.extname(name);
        const mime = mimeTypes.lookup(ext);
        const file = new File(fileId,name,this.dateUtil.getCurrentDate(),'','',ext,mime,size,directory,admin,users,[]);
        this.files.push(file);

        if(this.getFile('id',fileId)){
            success = true;
        }
        return success;

    }

    getFile(searchField,searchValue) {

        let file = false;

        for (let i = 0; i < this.files.length; i++) {
            let curFile = this.files[i];
            if (curFile[searchField] === searchValue) {
                file = curFile;
            }
        }

        return file;

    }


    updateFile(updateValue) {

        let success = false;

        if(this.getFile('id',updateValue.id)){
            let file = this.getFile('id',updateValue.id);
            file.id = updateValue.id;
            file.name = updateValue.name;
            file.created = updateValue.created;
            file.modified = updateValue.modified;
            file.accessed = updateValue.accessed;
            file.ext = updateValue.ext;
            file.mime = updateValue.mime;
            file.size = updateValue.size;
            file.directory = updateValue.directory;
            file.admin = updateValue.admin;
            file.users = updateValue.users;
            file.activity = updateValue.activity;
            success = true;
        }

        return success;


    }

    deleteFile(searchField,searchValue) {

        let success = false;

        for(let i = 0; i < this.files.length; i ++){

            let curFile = this.files[i];

            if(curFile[searchField] === searchValue){
                success = curFile;
                this.files.splice(i,1);
            }
        }

        return success;
    }

}
module.exports = {Files_Repo:Files_Repo};