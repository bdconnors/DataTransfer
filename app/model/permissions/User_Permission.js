class User_Permission{

    constructor(userId,view,edit,upload,download){
        this.userId = userId;
        this.view = view;
        this.edit = edit;
        this.upload = upload;
        this.download = download
    }

}
module.exports = {User_Permission:User_Permission};