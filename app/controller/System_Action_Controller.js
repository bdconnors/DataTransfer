class System_Action_Controller{

    constructor(sysPath,mailer,storage){
        this.sysPath = sysPath;
        this.mailer = mailer;
        this.storage = storage;
    }

    inviteUser(){

    }
    
    serveDashboard(req,res){
        this.sysPath.serveDashboard(req,res);
    }

    serveInviteForm(req,res){
        this.sysPath.serveInviteForm(req,res);
    }
    
    serveLoginFail(req,res) {
        this.sysPath.serveLoginFail(req,res)
    }

    serveLogin(req,res){
      this.sysPath.serveLogin(req,res);
    }
    serveUnAuthorized(req,res){
       this.sysPath.serveUnAuthorized(req,res);
    }

    /** System Redirects **/
    redirectToDashboard(req,res){
        res.redirect('/dashboard');
    }
    redirectToLogin(req,res){
        res.redirect('/login');
    }

    redirectToUnAuthorized(req,res){
        res.redirect('/unauthorized');
    }

    setUser(user){
        this.sysPath.setUser(user);
    }

    /** Session Methods **/
    getUser(){
        return this.sysPath.getUser();
    }

    setSystemUsers(users){
        this.sysPath.setSystemUsers(users);
    }

    loadAuthorizedProjects(){
        this.sysPath.loadAuthorizedProjects();
    }

    loadAuthorizedEntities(){
        this.sysPath.loadAuthorizedEntities();
    }

}
module.exports={System_Action_Controller:System_Action_Controller};