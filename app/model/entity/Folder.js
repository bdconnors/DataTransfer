const Entity = require('./Entity').Entity;

class Folder extends Entity{

    constructor(id,name,author,read,write,dir){
        super(id,name,author,read,write,true,dir);
        this.files = [];
    }

    addFile(file){

        this.files.push(file);
    }
    retrieveFile(id){

        let success = false;

        this.files.forEach((file)=>{

           if(file.id === id){ success = file; }

        });

        return success;

    }
    updateFile(id,field,value){

        let success = false;

        this.files.forEach((file)=>{

            if(file.id === id){ file[field] = value; }

            success = file;

        });

        return success;

    }
    deleteFile(id){

        let success = false;

        for(let i = 0; i < this.files.length; i++){

            if(this.files[i].id === id){

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