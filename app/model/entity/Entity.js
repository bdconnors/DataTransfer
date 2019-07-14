const uuid = require('uuid');
const fs = require('fs');

class Entity{

    constructor(dir,name,author,read,write,isFolder){

        this.id = uuid();
        this.name = name;
        this.author = author;
        this.read = read;
        this.write = write;
        this.isFolder = isFolder;
        this.dir = dir;
        this.size = fs.statSync(this.dir).size;
        this.created = fs.statSync(this.dir).ctime;
        this.modified = fs.statSync(this.dir).mtime;
        this.accessed = fs.statSync(this.dir).atime;

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

        this.size = fs.statSync(this.dir).size;
        return this.size;

    }
    getCreated() {

        this.created = fs.statSync(this.dir).ctime;
        return this.created;

    }
    getModified() {

        this.modified = fs.statSync(this.dir).mtime;
        return this.modified;

    }
    getAccessed() {

        this.accessed = fs.statSync(this.dir).atime;
        return this.accessed;

    }

}
module.exports = {Entity:Entity};