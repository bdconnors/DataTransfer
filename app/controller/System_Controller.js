const uuid = require('uuid');

class System_Controller{

    constructor(userRepo,storage){
        this.userRepo = userRepo;
        this.storage = storage;
        this.observers = [];
    }

    /** User Actions **/
    
    signIn(req,res){

        if(this.userRepo.verifyUser(req.body.email,req.body.password)){

            req.session.user = this.userRepo.getUser(req.body.email);
            this.user = this.userRepo.getUser(req.body.email);

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
        
        if(this.checkSessionIntegrity(req,res)){

            if(this.checkAdmin(req,res)){

                let projectName = req.body.name;
                let userPermissions = this.parsePermissions(req);

                if(this.storage.folderExists(projectName)){
                    res.render('./projects/addFail',{system:this,name:projectName});
                }else {

                    this.userRepo.addNewProject(projectName, userPermissions);
                    this.redirectToDashboard(res)
                }

            }else{

                res.send('Accessed Denied');

            }
            
        }else{

            this.redirectToLogin(res);

        }
        
    }
    addFolder(req,res){

        if(this.checkSessionIntegrity(req,res)){

            if(this.user.retrieveProject(req.query.project)){

                let foldername = req.body.name;
                let dir = req.body.dir;
                let userPermissions = this.parsePermissions(req);
                let project = this.user.retrieveProject(req.query.project);
                console.log(dir);
                console.log(foldername);
                if(this.storage.folderExists(dir+'/'+foldername)){
                    let projUsers = this.userRepo.getProjectUsers(req.query.project,this.user.id);
                    res.render('./projects/newFolderFail',{system:this,project:req.query.project,dir:dir,users:projUsers,name:foldername});
                }else {

                    this.userRepo.addFolder(this.user, project.id, foldername, userPermissions, dir);
                    this.redirectToDashboard(res);
                }
            }else{
                res.send('UnAuthorized');
            }

        }else{

            this.redirectToLogin(res);

        }


    }
    uploadFile(req,res){


        if(this.checkSessionIntegrity(req,res)){

            if(this.user.retrieveProject(req.query.project)){

                let project = req.query.project;
                let data = req.body.data;
                let fileName = req.body.input;
                let userPermissions = this.parsePermissions(req);
                console.log(req.body);
                console.log(userPermissions);
                let dir = req.body.dir;
                this.userRepo.uploadFile(project,this.user.id,data,fileName,userPermissions,dir);
                this.redirectToDashboard(res);

            }else{
                res.send('UnAuthorized');
            }

        }else{

            this.redirectToLogin(res);

        }
    }
    
    /** System Actions **/
    
    inviteUser(req,res) {

        let success = false;

        if (this.checkSessionIntegrity(req,res)){
            
            if(this.checkAdmin(req,res)) {

                let activity = this.userRepo.createUser(

                    this.user.email,
                    req.body.admin,
                    req.body.firstname,
                    req.body.lastname,
                    req.body.email

                );

                if (activity) {

                    let user = this.userRepo.getUser(req.body.email);
                    success = activity;

                    this.notifyAll('USER INVITED',activity);

                    let accountType;

                    if (user.admin) {

                        accountType = 'Administrator';

                    } else {

                        accountType = 'Standard';

                    }

                    res.render('./users/inviteSuccess', {

                            name: user.getFullName(),
                            email: user.getEmail(),
                            account: accountType,
                            system:this

                        }
                    );

                }

            }else{

                res.send('Access Denied');

            }
            
        }else{

            this.redirectToLogin(res);
        }

        return success;

    }

    authenticateNewUser(req,res) {


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
        
        if(this.checkSessionIntegrity(req,res)) {

            res.render('./dashboard/dashboard', {system: this});

        }else{

            this.redirectToLogin(res);

        }
        
    }
    displayAddFolder(req,res){

         if(this.checkSessionIntegrity(req,res)) {
             if(this.user.retrieveProject(req.query.project)) {
                 let project = this.user.retrieveProject(req.query.project);
                 let users = this.userRepo.getProjectUsers(req.query.project, this.user.id);
                 res.render('./projects/newFolder', {system: this, project: project, users: users,dir:project.name});
             }else{
                 res.send('UnAuthorized');
             }

         }else{
             this.redirectToLogin(res);
         }
    }
    displayFile(req,res){

         let project = this.user.retrieveProject(req.params.id);
         let file = project.retrieveEntity(req.query.id);
         this.storage.streamFile(file.dir+'/'+file.name,res);

    }
    displayUpload(req,res){

        if(this.checkSessionIntegrity(req,res)) {
            if(this.user.retrieveProject(req.query.project)) {
                let project = this.user.retrieveProject(req.query.project);
                let users = this.userRepo.getProjectUsers(req.query.project, this.user.id);
                res.render('./projects/upload', {system: this, project: project, users: users,dir:project.name});
            }else{
                res.send('UnAuthorized');
            }

        }else{
            this.redirectToLogin(res);
        }
    }

    displayProject(req,res){

         if(this.checkSessionIntegrity(req,res)) {
             if(this.user.retrieveProject(req.params.id)) {
                 let project = this.user.retrieveProject(req.params.id);
                 res.render('./projects/project', {system: this, project: project});
             }else{
                 res.send('UnAuthorized');
             }
         }else{
             this.redirectToLogin(res);
         }

    }
    displayCreateProjectForm(req,res){

        if(this.checkSessionIntegrity(req,res)){

            if(this.checkAdmin(req,res)){

                res.render('./projects/add',{system:this})
                
            }else{
                
                res.send('unauthorized')
                
            }
            
        }else{

            this.redirectToLogin(res);
        }
        
    }

    displayInviteUserForm(req,res){
        
        if(this.checkSessionIntegrity(req,res)) {
            
            if(this.checkAdmin(req,res)) {
                
                res.render('./users/invite',{system:this});
                
            }

        }else{

            this.redirectToLogin(res);

        }

    }

    displayUserAuthForm(req,res){
        console.log(req.query)
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
    
    checkAdmin(){ return this.user.admin; }

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
    getUserInfo(){ return this.user; }

    /** Observable Functions **/

    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(action,values){

        this.observers.map(observer => observer.notify(action,values));

    }

}



module.exports={System_Controller:System_Controller};
