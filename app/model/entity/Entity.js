const uuid = require('uuid');
const fs = require('fs');

class Entity{

    constructor(id,projectId,dir,name,author,isFolder){

        this.id = id;
        this.projectId = projectId;
        this.dir = dir;
        this.isFolder = isFolder;
        this.name = name;
        this.author = author;
        this.parents = [];
        this.created = '';
        this.accessed = '';
        this.modified = '';
    }

    addParent(id){

        this.parents.push(id);

    }
    getParent(id){

        let parent = false;

        this.parents.forEach(parentId=>{

            if(parentId === id){
                parent = parentId;
            }

        });

        return parent;

    }
    updateParent(id,newId){

        let oldParent = false;

        for(let i = 0; i < this.parents.length; i++){

            if(this.parents[i] === id){

                oldParent = this.parents[i];
                this.parents[i] = newId;

            }
        }

        return oldParent;

    }
    deleteParent(id){

        let parent = false;

        for(let i = 0; i < this.parents.length; i++){

            if(this.parents[i] === id){

                parent = this.parents[i];
                this.parents.splice(i,1);

            }
        }

        return parent
    }
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