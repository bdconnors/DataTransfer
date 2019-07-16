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

        fs.mkdirSync(this.livePath+path);

        if(!this.folderExistsBackup(path)){
            fs.mkdirSync(this.backupPath+path);
        }else{
            fs.mkdirSync(this.backupPath+path+uuid());
        }

    }
    deleteDirectory(path){
        console.log(path);
        rimraf.sync(this.livePath+path);
    }
    renameDirectory(oldir,newdir){

        fs.renameSync(this.livePath+oldir,this.livePath+newdir);
        fs.renameSync(this.backupPath+oldir,this.backupPath+newdir);

    }
    writeFile(path,data){

        fs.writeFileSync(this.livePath+path,data,{encoding:'base64'});
        if(!this.fileExists(this.backupPath+path)) {
            fs.writeFileSync(this.backupPath + path, data,{encoding:'base64'});
        }

    }
    deleteFile(path){
        fs.unlink(this.livePath+path,(err)=>{

        });
    }
    streamFile(file,res,disposition){

        let stream = fs.createReadStream(this.livePath+file.dir+'/'+file.name);
        stream.on('open',()=>{
            res.setHeader('Content-Disposition',disposition+'; filename='+file.name);
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
            this.makeDirectory(values+'/Intellectual Property');
            this.makeDirectory(values+'/Regulatory Affairs');
            this.makeDirectory(values+'/Clinical Information');
            this.makeDirectory(values+'/Market Analysis');
            this.makeDirectory(values+'/Business Development');
            this.makeDirectory(values+'/Misc');


        }else if (action === 'CREATE FOLDER') {

            this.makeDirectory(values);


        } else if (action === 'UPLOAD FILE') {

            this.writeFile(values.dir,values.data);

        }else if(action === 'DELETE FILE'){
            this.deleteFile(values);
        }else if(action === 'DELETE PROJECT'){
            this.deleteDirectory(values);
        }else if(action === 'DELETE FOLDER'){
            this.deleteDirectory(values);
        }else if(action === 'RENAME FOLDER'){
            this.renameDirectory(values.olddir,values.newdir)
        }
    }



}
module.exports = {File_System:File_System};