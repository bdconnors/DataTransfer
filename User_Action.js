const Authentication = require('./util/Authentication').Authentication;

class User_Action{

    constructor(user,folderRepo){
        this.user = user;
        this.userFolders= [];
        this.folderRepo = folderRepo;
        this.auth = new Authentication();
    }

    addFolder(name,admin,users){

        if(this.auth.checkAdmin(this.user)|| this.auth.checkWritePriv(this.user)) {
            return this.folderRepo.createFolder(name, admin, users).then((res)=>{
                return res;
            }).catch((err)=>{
                return err;
            });
        }

    }
    getFolder(searchField,searchValue){

        let success = false;

        const folder = this.folderRepo.getFolder(searchField,searchValue);
        const permitted = this.auth.checkFolderPermission(folder,this.user);

        if(permitted){
            success = this.folderRepo.getFolder(searchField,searchValue);

        }

        return success;
    }
    updateFolder(searchField,searchValue,newValue){

        let success = false;


        if(this.getFolder(searchField,searchValue)) {

            const folder = this.getFolder(searchField,searchValue);

            if (this.auth.checkAdmin(this.user) || this.auth.checkFolderAdmin(folder, this.user)) {

                success = this.folderRepo.updateFolder(searchField, searchValue, newValue);

            }

        }

        return success;

    }
    deleteFolder(searchField,searchValue){

        let success = false;

        if(this.getFolder(searchField,searchValue)|| this.auth.checkAdmin(this.user)){

            const folder = this.getFolder(searchField,searchValue);

            success = this.folderRepo.deleteFolder(searchField,searchValue);

        }

        return success;

    }
    addFile(foldername,name,data,admin,users){

        if(this.getFolder('name',foldername) && this.auth.checkWritePriv(this.user)){

            const folder = this.getFolder('name',foldername);
            const directory = './files/'+folder.name+'/';

            return this.folderRepo.addFile(foldername,name,data,directory,admin,users).
            then((result)=>{

                return result;

            }).
            catch((err)=>{

                return err;

            });

        }else{
            return false;
        }



    }
    getFile(folderid,searchField,searchValue,){

        let success = false;

        if(this.getFolder('id',folderid)) {

            if(this.folderRepo.getFile(folderid,searchField,searchValue)){

                const folder = this.getFolder('id',folderid);
                const file = this.folderRepo.getFile(folderid,searchField,searchValue);

                if(this.auth.checkFilePriv(file,this.user)){

                    success = this.getFile(folderid,searchField,searchValue);
                }
            }
        }

        return success;


    }
    updateFile(folderid,fileid,newValue){

        let success = false;

        if(this.getFolder('id',folderid)){

            const folder = this.getFolder('id',folderid);
            const file = this.getFile('id',fileid);

            if(this.auth.checkAdmin(this.user)||this.auth.checkFileAdmin(file,this.user)||this.auth.checkFolderAdmin(folder,user)) {

                success = this.folderRepo.updateFile(folderid, 'id', fileid, newValue);

            }
        }

        return success;
    }
    deleteFile(folderid,fileid) {

        let success = false;

        if(this.getFolder('id',folderid)){

            const folder = this.getFolder('id',folderid);
            const file = this.getFile(folderid,'id',fileid);

            if(this.auth.checkAdmin(this.user)||this.auth.checkFileAdmin(file,this.user)||this.auth.checkFolderAdmin(folder,user)) {

                success = this.folderRepo.deleteFile('id', fileid);


            }
        }
        return success;
    }
    load(){

        for(let i = 0; i < this.folderRepo.folders.length; i++){

            let folder= this.folderRepo.folders[i];

            if(this.auth.checkFolderPermission(folder,this.user)){
                this.userFolders[i] = folder
            }

        }
    }
}



module.exports={User_Action:User_Action};