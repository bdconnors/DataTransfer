const fs = require('fs');
const rimraf = require('rimraf');
const fileTypes = require('mime-types');

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

        fs.renameSync(this.dir+name,this.dir+newname);

        return this.checkFolder(newname);
    }
    renameFile(folder,name,newname){


        fs.renameSync(this.dir+folder+'/'+name,this.dir+folder+'/'+newname);
        console.log(this.checkFile(folder,newname));
        return this.checkFile(folder,newname);

    }
    deleteFolder(name){
        rimraf.sync(this.dir+name);
        return !this.checkFolder(name);
    }
    deleteFile(folder,file){

        fs.unlinkSync(this.dir+folder+'/'+file);

        return !this.checkFile(folder,file);
    }
    createFile(foldername,filename,data){

        fs.writeFileSync(this.dir+foldername+'/'+filename,data,'base64');
        return this.checkFile(foldername,filename);

    }
    streamFile(res,folder,file){
        const stream = fs.createReadStream(this.dir+folder+'/'+file);
        const mime = fileTypes.lookup(this.dir+folder+'/'+file);
        res.setHeader('Content-Type',mime);
        res.setHeader('Content-Disposition', 'inline; filename=' + file);
        stream.pipe(res);
    }


}
module.exports = {File_System:File_System};