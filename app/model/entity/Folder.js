const Entity = require('./Entity').Entity;

class Folder extends Entity{

    constructor(id,name,author,read,write,dir){
        super(id,name,author,read,write,true,dir);
        this.files = [];
    }

    addFile(file){

        this.files.push(file);
    }
    retrieveFile(name){

        let success = false;

        this.files.for((file)=>{

           if(file.name === name){ success = file; }

        });

        return success;

    }
    updateFile(name,field,value){

        let success = false;

        this.files.forEach((file)=>{

            if(file.name === name){ file[field] = value; }

            success = file;

        });

        return success;

    }
    deleteFile(name){

        let success = false;

        for(let i = 0; i < this.files.length; i++){

            if(this.files[i].name === name){

                success = this.files[i];

                this.files.splice(i,1);

            }

        }

        return success;
    }

    getFiles(){

        return this.files;

    }
    setFiles(files){

        this.files = files;

    }

}
module.exports = {Folder:Folder};