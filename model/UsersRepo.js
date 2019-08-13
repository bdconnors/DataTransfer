const uuid = require('uuid');
class UsersRepo {

    constructor(Users){
        this.Users = Users;
    }

    async createUser(firstname,lastname,email,projectPermissions){
        let newUser = new this.Users({id:uuid(),admin:false,firstname:firstname,lastname:lastname,email:email,projectPermissions:projectPermissions,authCode: uuid()});
        await newUser.save();
        return newUser;
    }
    async getUser(field,value){
        let downcase =value.toLocaleLowerCase();
        let results = await this.Users.find(this.makeQuery(field,downcase),{_id:0});
        if(results[0]){
            return results[0];
        }else{
            return false;
        }
    }
    async updateUser(field,value,updateQuery){
        let update = await this.Users.updateOne(this.makeQuery(field,value),updateQuery);
        if(update.nModified === 1){
            update = await this.getUser('id',value);
        }
        return update;
    }
    async deleteUser(field,value){

        return await this.Users.deleteOne(this.makeQuery(field,value));
    }
    async addFolderPermission(userid,folder,perms){
        let view = perms.view;
        let download = perms.download;
        let folderPermission = {folderId:folder.id,folderName:folder.name,view:view,download:download};
        let update = await this.Users.updateOne({"id":userid,"projectPermissions.projectId":folder.projectId},{"$push":{"projectPermissions.$.folderPermissions":folderPermission}});
        if(update.nModified === 1){
            update = await this.getUser('id',userid);
        }
        return update;
    }
    async getFolderUsers(projectId,folderId){

        return await this.Users.find({"projectPermissions": { "$elemMatch": {"projectId": projectId,"folderPermissions": {"$elemMatch": {"folderId": folderId}}}}});
    }
    async getProjectPermission(userid,projectid){
        let results =  await this.Users.findOne({ id:userid},{projectPermissions:{$elemMatch:{projectId: projectid}}},{_id:0});
        return results.projectPermissions[0];
    }
    async removeProjectPermission(userid,projectid){
        return await this.Users.updateOne({id:userid},{$pull:{'projectPermissions':{projectId:projectid}}});
    }
    async removeFolderPermission(userid,projectid,folderid){
        return await this.Users.updateOne({"id":userid,"projectPermissions.projectId":projectid},{"$pull":{"projectPermissions.$.folderPermissions":{folderId:folderid}}});
    }
    async getAllUsers(){
        return await this.Users.find({admin:false});

    }
    async deleteFolder(projectid,folderid){
        return await this.Users.updateMany({"projectPermissions.projectId":projectid},{$pull:{"projectPermissions.$.folderPermissions":{folderId:folderid}}});
    }
    async deleteProject(projectid){
        return await this.Users.updateMany({"projectPermissions.projectId":projectid},{$pull:{projectPermissions:{id:projectid}}});
    }
    async renameProject(projectid,newname){
        return await this.Users.updateMany({'projectPermissions.projectId':projectid},{$set:{'projectPermissions.$.projectName':newname}});
    }
    async renameFolder(projectid,folderid,newname){
        let folderUsers = await this.getFolderUsers(projectid,folderid);
        folderUsers.forEach(user=>{
            user.projectPermissions.forEach(projPerm=>{
                if(projPerm.projectId === projectid){
                    projPerm.folderPermissions.forEach(folderPerm=>{
                        folderPerm.folderName = newname;
                    });
                }
            });
        });
        let update = {nModified:0};
        for(let i = 0; i < folderUsers.length; i++) {
            let userUpdate = await this.Users.update({id: folderUsers[i].id}, {$set: {projectPermissions: folderUsers[i].projectPermissions}});
            if(userUpdate.nModified === 1){
                update.nModified += 1;
            }
        }
        return update;
    }
    async resetPassword(email){
        let user = await this.getUser('email',email);
        if(user){
            user.password = '';
            user.authCode = uuid();
            await this.Users.updateOne({email:email},{$unset:{password:''}});
            await this.Users.updateOne({email:email},{$set:{authCode:user.authCode}});
        }
        return user;
    }
    async submitResetPassword(account){
        let update;
        update = await this.Users.updateOne({id:account.id},{$unset:{authCode:''}});
        update = await this.Users.updateOne({id:account.id},{$set:{password:account.password}});
        if(update.nModified === 1){
            update = account;
        }else{
            update = false;
        }
        return update;
    }
    async getProjectUsers(id){
        return await this.Users.find({"projectPermissions.projectId":id},{_id:0});
    }
    async deleteUser(userid){
        return await this.Users.deleteOne({id:userid});
    }
    async logActivity(userid,activity){
        return await this.Users.updateOne({id:userid},{$push:{activity:activity}});
    }
    makeQuery(field,value){
        let query = {};
        query[field] = value;
        return query;
    }
}
module.exports = {UsersRepo:UsersRepo};