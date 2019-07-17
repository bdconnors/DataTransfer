const uuid = require('uuid');

class System_Controller{

    constructor(userRepo,storage){
        this.userRepo = userRepo;
        this.storage = storage;
        this.observers = [];
    }

    /** User Action Requests **/
    
    signIn(req,res){

        if(this.userRepo.verifyUser(req.body.email,req.body.password)){

            this.user = this.userRepo.getUser(req.body.email);


            req.session.user = this.user;



            if(this.getOriginPath(req)){

                this.redirectToOrigin(req,res);

            }else{

                this.redirectToDashboard(res);
            }

        }else{

            this.displayLoginFail(req,res)
        }

    }
    signOut(req,res){

        req.session.destroy();
        this.redirectToLogin(res);

    }
    createProject(req,res){

        if(this.checkSessionIntegrity(req)){
            if(this.user.admin){

                let projectName = req.body.name;
                let userPermissions = this.parsePermissions(req);

                if(this.storage.folderExists(projectName)){
                    res.render('./projects/addFail',{system:this,name:projectName});
                }else {
                    let users = this.userRepo.addNewProject(projectName, userPermissions);
                    users.forEach((user)=>{
                        if(user.id !== this.user.id && !user.admin) {
                            this.notifyAll('PROJECT ADD', {user: user, project: projectName});
                        }

                    });
                    this.redirectToDashboard(res)
                }

            }else{

                res.send('Accessed Denied');

            }
            
        }else{

            this.redirectToLogin(res);

        }
        
    }
    renameProject(req,res){

        if(this.checkSessionIntegrity(req)){

            if(this.user.admin){

                let project = this.user.retrieveProject(req.params.id);

                let newName = req.body.name;

                this.userRepo.renameProject(project,newName);
                this.redirectToDashboard(res);


            }else{

                res.send('Rename Proj form unauthorized')
            }

        }else{

            this.redirectToLogin(res)

        }

    }
    updateProjectPermissions(req,res){

        if(this.checkSessionIntegrity(req)) {

            if(this.user.retrieveProject(req.params.id)){

                if(this.user.admin){

                    let project = this.user.retrieveProject(req.params.id);

                    if(req.body.users){

                        let permissions = [];

                        if(typeof req.body.users === 'object'){

                            for(let i = 0; i < req.body.users; i ++){

                                permissions.push({id:req.body.users[i],permission:req.body[req.body.users[i]]});
                            }


                        }else{

                            permissions.push({id:req.body.users,permission:req.body[req.body.users]});

                        }

                        this.userRepo.updateProjectPermissions(project,permissions);
                        res.redirect('/projects/project/'+project.id);

                    }else{

                        res.redirect('/projects/project/'+project.id);

                    }

                }else{

                    res.send('UnAuthorized');

                }
            }else{
                res.end('UnAuthorized');
            }


        }else{

            this.redirectToLogin(res)

        }

    }
    addFolder(req,res){

        if(this.checkSessionIntegrity(req)){

            if(this.user.retrieveProject(req.params.id)){

                let foldername = req.body.name;
                let userPermissions = this.parsePermissions(req);
                let project = this.user.retrieveProject(req.params.id);


                if (this.storage.folderExists(project.name + '/' + foldername)) {

                    let projUsers = this.userRepo.getProjectUsers(req.params.id);
                    res.render('./projects/newFolderFail', {
                        system: this,
                        project: req.params.id,
                        users: projUsers,
                        name: foldername
                    });

                } else {

                    let users = this.userRepo.addFolder(this.user, project, foldername, userPermissions);
                    users.forEach(user => {
                        if (user.id !== this.user.id && !user.admin) {
                            this.notifyAll('FOLDER ADD', {user: user, folder: foldername, project: project.name});
                        }
                    });
                    res.redirect('/projects/project/' + project.id);
                }

            }else{
                res.send('UnAuthorized');
            }

        }else{

            this.redirectToLogin(res);

        }


    }
    uploadFileToFolder(req,res){

        if(this.checkSessionIntegrity(req)) {

            if(this.user.retrieveProject(req.params.id)){

                let project = this.user.retrieveProject(req.params.id);

                if(project.retrieveEntity(req.params.folderid)){
                    let folder = project.retrieveEntity(req.params.folderid);

                    if(this.user.admin || folder.write){

                        let fileName = req.body.input;
                        let data = req.body.data;
                        let userPermissions = this.parsePermissions(req);

                        if (this.storage.fileExists(project.name + '/' + fileName)) {

                            res.send('Already Exists')

                        } else {

                            let users = this.userRepo.uploadFileToFolder(project,folder, this.user.id, data, fileName, userPermissions);

                            users.forEach(user => {
                                if(user.id !== this.user.id && !user.admin) {
                                    this.notifyAll('FOLDER FILE ADD', {user: user, file: fileName,project: project.name, folder:folder.name})
                                }
                            });

                            res.redirect('/projects/project/'+project.id+'/folders/folder/'+folder.id);
                        }

                    }else{
                        res.send('unauthorized');
                    }

                }else{
                    res.send('unauthorized');
                }

            }else{
                res.send('unauthorized');
            }

        }else{
            this.redirectToLogin(res);
        }

    }
    uploadFileToProject(req,res){


        if(this.checkSessionIntegrity(req)){

            if(this.user.retrieveProject(req.params.id)){

                let userPermission= this.user.retrieveProject(req.params.id);

                if(this.user.admin || userPermission.write) {

                    let data = req.body.data;
                    let fileName = req.body.input;
                    let userPermissions = this.parsePermissions(req);

                    if (this.storage.fileExists(userPermission.name + '/' + fileName)) {

                        res.send('Already Exists')

                    } else {

                        let users = this.userRepo.uploadFileToProject(userPermission, this.user.id, data, fileName, userPermissions);

                        users.forEach(user => {
                            if(user.id !== this.user.id && !user.admin) {
                                this.notifyAll('FILE ADD', {user: user, file: fileName, project: userPermission.name})
                            }
                        });

                        res.redirect('/projects/project/' + req.params.id);
                    }
                }else{
                    res.send('UnAuthorized');
                }

            }else{
                res.send('UnAuthorized');
            }

        }else{

            this.redirectToLogin(res);

        }
    }
    renameFile(req,res){
        if(this.checkSessionIntegrity(req)){

            if(this.user.retrieveProject(req.params.id)){

                let project = this.user.retrieveProject(req.params.id);
                let newName = req.body.name;

                if(req.query.folder){

                    let folder = project.retrieveEntity(req.query.folder);

                    if (this.user.admin || folder.write) {
                        let file = folder.retrieveFile(req.params.fileid);
                        this.userRepo.renameFile(project,folder,file,newName);
                        res.redirect('/projects/project/'+project.id+'/folders/folder/'+folder.id);

                    }else{
                        res.send('unauthorized');
                    }


                }else{

                    if(this.user.admin||project.write){

                        let file = project.retrieveEntity(req.params.fileid);
                        this.userRepo.renameFile(project,false,file,newName);
                        res.redirect('/projects/project/'+project.id);

                    }else{

                        res.send('unauthorized')

                    }

                }

            }else{
                res.send('unauthorized');
            }

        }else{
           res.redirectToLogin(res);
        }
    }
    deleteProject(req,res){
        if(this.checkSessionIntegrity(req)) {

            let project = this.user.retrieveProject(req.params.id);
            if(this.user.admin || project.write) {

                this.userRepo.deleteProject(project);
                this.redirectToDashboard(res);

            }else{
                res.send('UnAuthorized')
            }

        }else{
            this.redirectToLogin(res);
        }
    }
    renameFolder(req,res){

        if(this.checkSessionIntegrity(req)){

            if(this.user.retrieveProject(req.params.id)){

                let project = this.user.retrieveProject(req.params.id);
                let folder = project.retrieveEntity(req.params.folderid);

                if(this.user.admin || project.write){

                    this.userRepo.renameFolder(project,folder,req.body.name);
                    res.redirect('/projects/project/'+project.id);
                }else{

                    res.send('Un-Authorized');
                }

            }else{
                res.send('Un-Authorized')
            }

        }else{
            this.redirectToLogin(res);
        }

    }
    deleteFolder(req,res){
        if(this.checkSessionIntegrity(req)) {

            let project = this.user.retrieveProject(req.params.id);
            let folder = project.retrieveEntity(req.query.id);
            if(this.user.admin || project.write) {
                this.userRepo.deleteFolder(project,folder);
                res.redirect('/projects/project/'+project.id);
            }else{
                res.send('UnAuthorized');
            }
        }else{
            this.redirectToLogin(res);
        }
    }
    deleteFile(req,res){

        if(this.checkSessionIntegrity(req)) {

            let projectid = req.params.id;
            let fileid = req.params.fileid;

            if(req.body.folder){

                let folderid = req.body.folder;

                if(this.user.retrieveProject(projectid)){

                    let project = this.user.retrieveProject(projectid);

                    if(project.retrieveEntity(folderid)){

                        let folder = project.retrieveEntity(folderid);

                        if(folder.retrieveFile(fileid)){

                            let file = folder.retrieveFile(fileid);

                            if(this.user.admin || file.write){

                                this.userRepo.deleteFile(project,folder,file);
                                res.redirect('/projects/project/'+project.id+'/folders/folder/'+folder.id);

                            }else{
                                res.send('unauthorized');
                            }

                        }else{

                            res.send('unauthorized');
                        }

                    }else{
                        res.send('unauthorized');

                    }

                }else{
                    res.send('unauthorized');
                }

            }else{
                if(this.user.retrieveProject(projectid)) {

                    let project = this.user.retrieveProject(req.params.id);

                    if(project.retrieveEntity(req.params.fileid)) {

                        let file = project.retrieveEntity(req.params.fileid);

                        if (this.user.admin ||  file.write === true) {

                            this.userRepo.deleteFile(project,false,file);
                            res.redirect('/projects/project/' + project.id);

                        } else {

                            res.send('unauthorized');
                        }
                    }else{
                        res.send('unauthorized');
                    }
                }else{
                    res.send('unauthorized');
                }
            }

        }else{

            this.redirectToLogin(res);
        }


    }
    downloadFile(req,res){

        if(this.checkSessionIntegrity(req)) {

            let project = this.user.retrieveProject(req.params.id);
            let file = project.retrieveEntity(req.params.fileid);

            if(this.user.admin ||file.write) {
                this.storage.streamFile(file, res, 'attachment');
            }else{
                res.send('UnAuthorized to Download')
            }

        }else{
            this.redirectToLogin(res);
        }

    }
    /** System Actions **/
    
    inviteUser(req,res) {

        if (this.checkSessionIntegrity(req)){
            
            if(this.user.admin) {

                let user = this.userRepo.createUser(

                    req.body.admin,
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email

                );

                let accountType;

                if (user.admin) {

                    accountType = 'Administrator';

                } else {

                    accountType = 'Standard';

                }

                this.notifyAll('USER INVITED',{firstname:req.body.firstname,email:req.body.email,authCode:user.authCode});

                res.render('./users/inviteSuccess', {

                        name: user.getFullName(),
                        email: user.getEmail(),
                        account: accountType,
                        system:this

                });



            }else{

                res.send('Access Denied');

            }
            
        }else{

            this.redirectToLogin(res);
        }


    }

    authenticate(req,res) {


        if (this.userRepo.newUserUpdate(req.body.authcode, req.body.phone, req.body.password)) {

            this.displayAuthSuccess(req, res);

        } else {

            res.send('server error');

        }

    }

    
    /** System Displays **/

     displayLogin(req,res){

        res.render('./login/login');

    }
    
     displayLoginFail(req, res){

        res.render('./login/fail',{email:req.body.email,password:req.body.password});

    }
    
    displayDashboard(req,res){
        
        if(this.checkSessionIntegrity(req)) {

            res.render('./dashboard/dashboard', {system: this});

        }else{

            this.redirectToLogin(res);

        }
        
    }
    displayFolder(req,res){
         if(this.checkSessionIntegrity(req)){
             let project = this.user.retrieveProject(req.params.id);
             let folder = project.retrieveEntity(req.params.folderid);
             if(this.user.admin || folder.read){
                 res.render('./folder/folder',{system:this,project:project,folder:folder});
             }else{
                 res.send('UnAuthorized');
             }
         }else{
             this.redirectToLogin(res);
         }
    }
    displayAddFolder(req,res){

         if(this.checkSessionIntegrity(req)) {
             if(this.user.retrieveProject(req.params.id)) {
                 let project = this.user.retrieveProject(req.params.id);
                 let users = this.userRepo.getProjectUsers(req.params.id);
                 res.render('./projects/newFolder', {system: this, project: project, users: users,dir:project.name});
             }else{
                 res.send('UnAuthorized');
             }

         }else{
             this.redirectToLogin(res);
         }
    }
    displayFolderUploadForm(req,res){

        if(this.checkSessionIntegrity(req)) {
            if(this.user.retrieveProject(req.params.id)) {

                let project = this.user.retrieveProject(req.params.id);
                let folder = project.retrieveEntity(req.params.folderid);

                if(this.user.admin || project.write || folder.write) {
                    let users = this.userRepo.getProjectUsers(req.params.id);
                    res.render('./file/upload',{system:this,project:project,folder:folder,users:users})

                }else{
                    res.send('UnAuthorized');
                }
            }else{
                res.send('UnAuthorized');
            }

        }else{
            this.redirectToLogin(res);
        }

    }
    displayFolderRenameForm(req,res){

        if(this.checkSessionIntegrity(req)) {

            if(this.user.retrieveProject(req.params.id)) {

                let project = this.user.retrieveProject(req.params.id);
                let folder = project.retrieveEntity(req.params.folderid);

                if(this.user.admin || project.write){
                    res.render('./folder/rename',{system:this,project:project,folder:folder})
                }else{
                    res.send('UnAuthorized Action');
                }

            }else{
                res.send('UnAuthorized');
            }

        }else{
            this.redirectToLogin(res);
        }

    }
    displayFile(req,res){

         if(this.checkSessionIntegrity(req)) {

             let project = this.user.retrieveProject(req.params.id);
             let file = project.retrieveEntity(req.params.fileid);

             if(this.user.admin ||file.read) {
                 this.storage.streamFile(file, res, 'inline');
             }else{
                 res.send('UnAuthorized to View')
             }

         }else{
             this.redirectToLogin(res);
         }

    }
    displayFileRenameForm(req,res){

         if(this.checkSessionIntegrity(req)){

             if(this.user.retrieveProject(req.params.id)) {

                let project = this.user.retrieveProject(req.params.id);
                console.log(project);
                let file;

                if(req.query.folder) {

                    let folder = project.retrieveEntity(req.query.folder);
                    console.log(folder);
                    file = folder.retrieveFile(req.params.fileid);
                    console.log(file);
                    console.log(file.name);
                    if(this.user.admin || file.write){

                        res.render('./file/rename',{system:this,project:project,folder:folder,file:file});
                    }

                }else{

                    file = project.retrieveEntity(req.params.fileid);

                    if(this.user.admin ||  file.write){

                        res.render('./file/rename',{system:this,project:project,folder:false,file:file});

                    }else{
                        res.send('UnAuthorized');
                    }

                }


             }else{
                 res.send('UnAuthorized');
             }

         }else{
             this.redirectToLogin(res);
         }

    }
    displayProjectUploadForm(req,res){

        if(this.checkSessionIntegrity(req)) {
            if(this.user.retrieveProject(req.params.id)) {

                let project = this.user.retrieveProject(req.params.id);
                let users = this.userRepo.getProjectUsers(req.params.id);



                if(this.user.admin || project.write){

                    res.render('./file/upload', {system: this, project: project, folder:false,users: users,dir:project.name});

                }else{

                    res.send('UnAuthorized');
                }


            }else{
                res.send('UnAuthorized');
            }

        }else{
            this.redirectToLogin(res);
        }
    }

    displayProject(req,res){

         if(this.checkSessionIntegrity(req)) {

             if(this.user.retrieveProject(req.params.id)) {

                 let project = this.user.retrieveProject(req.params.id);

                 if(this.user.admin || project.read) {
                     res.render('./projects/project', {system: this, project: project});
                 }else{
                     res.send('unauthorized');
                 }
             }else{
                 res.send('UnAuthorized');
             }
         }else{
             this.redirectToLogin(res);
         }

    }
    displayProjectPermissions(req,res){

         if(this.checkSessionIntegrity(req)){

             if(this.user.admin){
                 let project = this.user.retrieveProject(req.params.id);
                 let projectUsers = this.userRepo.getProjectUsers(project.id);
                 res.render('./projects/permissions',{system:this,project:project,projectUsers:projectUsers});

             }else{
                 res.send('unauthorized');
             }

         }else{
             this.redirectToLogin(res);
         }
    }
    displayCreateProjectForm(req,res){

        if(this.checkSessionIntegrity(req)){

            if(this.user.admin === true){

                res.render('./projects/add',{system:this})
                
            }else{
                
                res.send('unauthorized')
                
            }
            
        }else{

            this.redirectToLogin(res);
        }
        
    }

    displayProjectRenameForm(req,res){

         if(this.checkSessionIntegrity(req)){

             if(this.user.admin){

                let project = this.user.retrieveProject(req.params.id);
                 res.render('./projects/rename',{system:this,project:project});

             }else{
                 res.send('unauthorized')
             }


         }else{

             this.redirectToLogin(res);

         }

    }

    displayInviteUserForm(req,res){
        
        if(this.checkSessionIntegrity(req)) {
            
            if(this.user.admin) {
                
                res.render('./users/invite',{system:this});
                
            }else{
                res.send('invite form unauthorized')
            }

        }else{

            this.redirectToLogin(res);

        }

    }

    displayAuthenticationForm(req,res){

        let user = this.userRepo.getUserBy('authCode',req.query.authcode);
        res.render('./users/auth',{name:user.getFullName(),authCode:req.query.authcode});

    }

    displayAuthSuccess(req,res){


         let user = this.userRepo.newUserUpdate(req.body.authCode,req.body.phone,req.body.password);
         if(user) {
             res.render('./users/authSuccess', {name: user.getFullName(), email: user.getEmail()});
         }
    }

    displayProjectsIndex(req,res){

         if(this.checkSessionIntegrity(req)){
             res.render('./projects/projects',{system:this});
         }else{

             this.redirectToLogin(res);

         }
    }

    /** Origin Path Redirection **/

    getOriginPath(req){
        return req.session.originPath;
    }

    setOriginPath(req,path){
        req.session.originPath = path;
    }

    redirectToLogin(res){
        res.redirect('/');
    }
    redirectToDashboard(res){
        res.redirect('/dashboard');
    }

    redirectToOrigin(req,res){
        res.redirect(req.session.originPath);
    }
    
    /** Authentication Functions **/
    
    checkSessionIntegrity(req){
        
        let sameUser = false;

        if(req.session && req.session.user) {

            if (req.session.user.id === this.user.id) {

                sameUser = true;

            } else {

                req.session.destroy();
                sameUser = false;

            }

        }else{
            this.setOriginPath(req,req.url);
        }

        return sameUser;
    }


    parsePermissions(req){

        let userPermissions = [];

        if(req.body.users) {
            let users = req.body.users;
            if (typeof users === 'object') {

                for (let i = 0; i < users.length; i++) {

                    let curUser = users[i];
                    let curPermission = {id: curUser.id, permission: req.body[curUser]};
                    userPermissions.push(curPermission);
                }

            } else {

                userPermissions.push({id: users, permission: req.body[users]});

            }

        }

        return userPermissions;
    }
    
    /** User Account Retrieval Functions **/

    getAllUsers(){ return this.userRepo.users; }
    getUserInfo(){return this.user};

    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(action,values){

        this.observers.map(observer => observer.notify(action,values));

    }

    notify(action,value){

        if(action === 'UPDATE USER'){

            if(value.id === this.user.id){
                this.user = value;
            }
        }

    }

}



module.exports={System_Controller:System_Controller};
