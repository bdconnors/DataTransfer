const fs = require('fs');
const rimraf = require('rimraf');
const fileTypes = require('mime-types');

class File_System{

    constructor(livePath,backupPath){
        this.livePath = livePath;
        this.backupPath = backupPath;
    }
    makeDirectory(path){
        fs.mkdirSync(this.livePath+path);
        fs.mkdirSync(this.backupPath+path);
    }
    notify(action,values){

        if(action === 'CREATE PROJECT'){

            this.makeDirectory(values);

        }

    }


}
module.exports = {File_System:File_System};