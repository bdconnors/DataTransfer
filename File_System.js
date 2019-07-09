const fs = require('fs');
const rimraf = require('rimraf');

class File_System{

    constructor(){
        this.dir = __dirname+'/storage/';
    }

    checkFolder(foldername){
        return fs.existsSync(this.dir+foldername);
    }
    checkFile(foldername,filename) {
        return fs.existsSync(this.dir+foldername+'/'+filename);
    }
    createFolder(name){

        fs.mkdirSync(this.dir+name);
        return this.checkFolder(name);

    }
    renameFolder(name,newname){

        let success = false;

        fs.rename(this.dir + name, this.dir + newname, (err) => {

            if (err) {throw err}
            success = true;

        });

        return success;
    }
    deleteFolder(name){

        let success = false;

        rimraf(this.dir+name,(err)=>{

            if(err){throw err}
            success = true;

        });

        return success;
    }


}
module.exports = {File_System:File_System};