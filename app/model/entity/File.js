const Entity = require('./Entity').Entity;
const path = require('path');
const fileTypes = require('mime-types');

class File extends Entity {

    constructor(id,projectId,dir,name,author) {

        super(id,projectId,dir,name,author,false);
        this.ext = path.extname(this.dir + name);
        this.mime = fileTypes.lookup(this.dir + name);

    }

    getExt() {

        this.ext = path.extname('/home/brandon/DataTransfer/docs/live/'+this.dir + this.name);
        return this.ext;

    }

    getMime() {

        this.mime = fileTypes.lookup('/home/brandon/DataTransfer/docs/live/'+this.dir + this.name);
        return this.mime;

    }

}

module.exports = {File:File};