const fs = require('fs');
const rimraf = require('rimraf');
const fileTypes = require('mime-types');
const uuid = require('uuid');

class File_System{

    constructor(livePath,backupPath,errorLogPath,activityLogPath){
        this.livePath = livePath;
        this.backupPath = backupPath;
        this.errorLogPath = errorLogPath;
        this.activityLogPath = activityLogPath;
    }
    makeDirectory(path){
        console.log(path);
        fs.mkdirSync(this.livePath+path);

        if(!this.folderExistsBackup(path)){
            fs.mkdirSync(this.backupPath+path);
        }else{
            fs.mkdirSync(this.backupPath+path+uuid());
        }

    }
    writeFile(path,data){

        fs.writeFileSync(this.livePath+path,data);
        if(!this.fileExists(this.backupPath+path)) {
            fs.writeFileSync(this.backupPath + path, data);
        }

    }
    streamFile(path,res){
        let stream = fs.createReadStream(this.livePath+path);
        stream.on('open',()=>{
            stream.pipe(res);
        });
    }
    folderExists(path){
        console.log(fs.existsSync(this.livePath+path));
        return fs.existsSync(this.livePath+path)
    }
    folderExistsBackup(path){
        return fs.existsSync(this.backupPath+path)
    }
    fileExists(path){
        try{
            fs.accessSync(this.livePath+path);
            return true;
        }catch(e){
            return false;
        }
    }
    appendActivityLog(activity){

        let stream = fs.createWriteStream(this.activityLogPath,{flags:'a'});

        stream.once('open',(fd)=>{

            activity.forEach((line)=>{
                stream.write(line);
            });

            stream.end();

        });

    }
    notify(action,values) {

        if (action === 'CREATE PROJECT') {

            this.makeDirectory(values);

        }else if (action === 'CREATE FOLDER') {

            this.makeDirectory(values);


        } else if (action === 'UPLOAD FILE') {

            this.writeFile(values.dir,values.data);

        }else if(action === 'LOAD'){

        }
    }



}
module.exports = {File_System:File_System};