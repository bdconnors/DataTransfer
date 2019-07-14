const Entity = require('./Entity').Entity;
const path = require('path');
const fileTypes = require('mime-types');

class File extends Entity {

    constructor(dir,name,author,read,write) {

        super(dir,name,author,read,write,false);
        this.ext = path.extname(this.dir + name);
        this.mime = fileTypes.lookup(this.dir + name);

    }

    getExt() {

        this.ext = path.extname(this.dir + name);
        return this.ext;

    }

    getMime() {

        this.mime = fileTypes.lookup(this.dir + name);
        return this.mime;

    }

}

module.exports = {File:File};