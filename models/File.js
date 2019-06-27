class File{
    constructor(id,name,uploadDate,uploadedBy,size,directory){
        this.id = id;
        this.name = name;
        this.uploadDate = uploadDate;
        this.uploadedBy = uploadedBy;
        this.size = size;
        this.directory = directory;
    }
}
module.exports = {File:File};