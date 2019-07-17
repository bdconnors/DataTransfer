const uuid = require('uuid');
const fs = require('fs');

class Entity{

    constructor(id,name,author,read,write,isFolder,dir){

        this.id = id;
        this.name = name;
        this.author = author;
        this.read = read;
        this.write = write;
        this.isFolder = isFolder;
        this.dir = dir;
        this.created = '';
        this.accessed = '';
        this.modified = '';
    }

    getId(){ return this.id; }
    setId(id){ this.id = id; }

    getName(){ return this.name; }
    setName(name){ this.name = name; }

    getAuthor(){ return this.author; }
    setAuthor(author){ this.author = author; }

    getRead(){ return this.read; }
    setRead(read){ this.read = read; }

    getWrite(){ return this.write; }
    setWrite(write){ this.write = write; }

    getIsFolder(){ return this.isFolder; }
    setIsFolder(isFolder){ this.isFolder = isFolder }

    getDir(){ return this.dir; }
    setDir(dir){ this.dir = dir; }


    getSize() {

        this.size = fs.statSync('/home/brandon/DataTransfer/docs/live/'+this.dir+'/'+this.name).size;
        return this.size;

    }
    getCreated() {

        this.created = fs.statSync('/home/brandon/DataTransfer/docs/live/'+this.dir+'/'+this.name).ctime;
        return this.created;

    }
    getModified() {

        this.modified = fs.statSync('/home/brandon/DataTransfer/docs/live/'+this.dir+'/'+this.name).mtime;
        return this.modified;

    }
    getAccessed() {

        this.accessed = fs.statSync('/home/brandon/DataTransfer/docs/live/'+this.dir+'/'+this.name).atime;
        return this.accessed;

    }

}
module.exports = {Entity:Entity};