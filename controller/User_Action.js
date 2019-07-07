const Authentication = require('../util/Authentication').Authentication;

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
				this.userFolders.push(res);
				console.log(this.userFolders);
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

        return this.folderRepo.deleteFolder(searchField,searchValue).then((res)=>{
            for(let i = 0; i < this.userFolders.length; i++){

                let curFolder = this.userFolders[i];

                if(curFolder[searchField] === searchValue){
                    this.userFolders.splice(i,1);
                    return res;
                }
            }
        }).catch((err)=>{
            return err;
        })

    }
    addFile(foldername,name,data,users){

        if(this.getFolder('name',foldername) && this.auth.checkWritePriv(this.user)){

            const folder = this.getFolder('name',foldername);
            const directory = './storage/'+folder.name+'/';


            return this.folderRepo.addFile(foldername,name,data,directory,users).
            then((result)=>{

                return true;

            }).
            catch((err)=>{

                return false;

            });

        }else{
            return false;
        }



    }
    getFile(folderid,searchField,searchValue,){

        this.folderRepo.getFile(folderid,searchField,searchValue).then((res)=>{
            return res;
        }).catch((err)=>{
            return err;
        })


    }
    updateFile(folderid,fileid,newValue){


    }
    deleteFile(foldername,filename) {

        return this.folderRepo.deleteFile(foldername,'name',filename).then((res)=>{
            return res;
        }).catch((err)=>{
            return err;
        })
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
