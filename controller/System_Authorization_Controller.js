class System_Authorization_Controller{

    constructor(userControl,projectControl,entityControl){
        this.userControl = userControl;
        this.projectControl = projectControl;
        this.entityControl = entityControl;
        this.observers=[];
    }


    /** POST request authorization **/
    logInAuth(req,res){

        let email = req.body.email;
        let password = req.body.password;
        let user = this.userControl.checkAccountCredentials(email,password);

        if(user){
            req.session.user = user;

            this.notifyAll('LOGIN SUCCESSFUL',req,res,this.getAccountValues(req));
        }else{
            this.notifyAll('LOGIN FAILED',req,res,this.getFailedLoginValues(req));
        }

    }
    logOut(req,res){
        this.destroySession(req);
        this.notifyAll('USER LOGGED OUT',req,res);
    }
    inviteUserAuth(req,res){
        if(this.verifyAdmin(req,res)){
            this.notifyAll('POST INVITE AUTHORIZED',req,res,this.userControl);
        }
    }
    newUserAuth(req,res){
        if(this.userControl.getUserBy('authCode',req.query.authcode)){
            let user = this.userControl.getUserBy('authCode',req.query.authcode);
            this.notifyAll('POST NEW USER EXISTS',req,res,{user:user,userControl:this.userControl});
        }else{
            this.notifyAll('POST NEW USER NOT FOUND',req,res);
        }
    }
    createProjectAuth(req,res){
        if(this.verifyAdmin(req,res)){
            this.notifyAll('POST CREATE PROJECT AUTHORIZED',req,res,this.getControllers());
        }
    }
    /** GET request authorization **/
    dashboardAuth(req,res){
        if(this.verifySessionIntegrity(req,res)){
            this.notifyAll('GET DASHBOARD AUTHORIZED',req,res);
        }
    }
    inviteFormAuth(req,res){
        if(this.verifyAdmin(req,res)){
            this.notifyAll('GET INVITE AUTHORIZED',req,res);
        }
    }
    newUserCheck(req,res){
        if(this.userControl.getUserBy('authCode',req.query.authcode)){
            let user = this.userControl.getUserBy('authCode',req.query.authcode);
            console.log(user);
            this.notifyAll('GET NEW USER EXISTS',req,res,user);
        }else{
            this.notifyAll('GET NEW USER NOT FOUND',req,res);
        }
    }
    userProfileAuth(req,res){
        if(this.verifySessionIntegrity(req,res)){
            if(this.userControl.getUserBy('id',req.params.id)) {
                let user = this.userControl.getUserBy('id',req.params.id);
                this.notifyAll('GET USER PROFILE AUTHORIZED',req,res,user);
            }
        }
    }
    createProjectFormAuth(req,res){
        if(this.verifyAdmin(req,res)){
            this.notifyAll('GET CREATE PROJECT AUTHORIZED',req,res,);
        }
    }
    projectAuth(req,res){
        if(this.verifySessionIntegrity(req,res)){
            if(this.hasProjectPermission(req,res)){
                let project = this.projectControl.getProject(req.params.id);
                let folderPermissions = req.session.user.folderPermissions;
                let filePermissions = req.session.user.filePermissions;
                let rootFolders = this.entityControl.getPermittedRootEntities(project.id,folderPermissions);
                let rootFiles = this.entityControl.getPermittedRootEntities(project.id,filePermissions);
                let entities = rootFolders.concat(rootFiles);
                this.notifyAll('GET PROJECT AUTHORIZED',req,res,{project:project,entities:entities});
            }
        }
    }

    /** User Authorization Methods **/
    verifySessionIntegrity(req,res){
        if(req.session && req.session.user){
            if(!req.session.user.id ===  this.user.id){
                this.destroySession(req);
                this.notifyAll('BAD SESSION',req,res);
            }else{
                return true;
            }
        }else{
            this.notifyAll('BAD SESSION',req,res);
        }
    }
    hasProjectPermission(req,res){
        if(this.userControl.hasProjectPermission(req.session.user,req.params.id)) {
            if (this.projectControl.getProject(req.params.id)) {
                return true;
            }else{
                this.notifyAll('INTEGRITY ERROR',req,res);
            }
        }else{
            this.notifyAll('UNAUTHORIZED',req,res);
        }
    }
    verifyAdmin(req,res){
        if(this.verifySessionIntegrity(req,res)){
            if(!req.session.user.admin){
                this.notifyAll('UNAUTHORIZED',req,res);
            }else{
                return true;
            }
        }
    }

    getControllers(){
        return{userControl:this.userControl,projectControl:this.projectControl,entityControl:this.entityControl};
    }
    getAccountValues(req){
        
        let accountValues = {};
        this.user = req.session.user;
        
        accountValues.user = this.user;
        
        let projectPermissions = this.user.projectPermissions;
        let folderPermissions = this.user.folderPermissions;
        let filePermissions = this.user.filePermissions;
        
        accountValues.systemUsers = this.userControl.getAllUsers();
        accountValues.projects = this.projectControl.getPermittedProjects(projectPermissions);
        accountValues.folders = this.entityControl.getPermittedEntities(folderPermissions);
        accountValues.files = this.entityControl.getPermittedEntities(filePermissions);
        
        return accountValues;
    }

    getFailedLoginValues(req){
        
       let values = {};
       
       values.email = req.body.email;
       values.password = req.body.password;
       
       return values;
       
    }
    /** Session Methods **/
    destroySession(req){
        req.session.destroy();
    }

    notify(message,req,res){
        if(message === 'POST LOGIN'){
            this.logInAuth(req,res);
        }else if(message === 'POST INVITE'){
            this.inviteUserAuth(req,res);
        }else if(message === 'GET DASHBOARD'){
            this.dashboardAuth(req,res);
        }else if(message === 'GET INVITE'){
            this.inviteFormAuth(req,res);
        }else if(message === 'GET NEW USER AUTH'){
            this.newUserCheck(req,res);
        }else if(message === 'POST NEW USER AUTH'){
            this.newUserAuth(req,res);
        }else if(message === 'GET USER PROFILE'){
            this.userProfileAuth(req,res);
        }else if(message === "GET CREATE PROJECT"){
            this.createProjectFormAuth(req,res);
        }else if(message === 'POST CREATE PROJECT'){
            this.createProjectAuth(req,res);
        }else if(message === 'GET PROJECT'){
            this.projectAuth(req,res);
        }
    }
    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(message,req,res,values){

        this.observers.map(observer => observer.notify(message,req,res,values));

    }

}
module.exports = {System_Authorization_Controller:System_Authorization_Controller};