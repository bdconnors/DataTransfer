class System_Path_Controller{

    constructor(projectControl,entityControl){
        this.projectControl = projectControl;
        this.entityControl = entityControl;
    }

    /** System Displays **/
    serveInviteForm(req,res){
        res.render('./users/invite',{user:this.user,projects:this.authorizedProjects,users:this.systemUsers});
    }
    serveDashboard(req,res){

       res.render('./dashboard/dashboard',{user:this.user,projects:this.authorizedProjects,users:this.systemUsers})
    }
    
    serveLoginFail(req,res){
        res.render('./login/fail',{email:req.body.email,password:req.body.password});}

    serveLogin(req,res){
        res.render('./login/login');
    }
    serveUnAuthorized(req,res){
        res.send('Un-Authorized User Action');
    }


    setUser(user){
        this.user = user
    }
    getUser(){
        return this.user;
    }
    setSystemUsers(users){
        this.systemUsers = users;
    }

    loadAuthorizedProjects(){
       this.authorizedProjects = this.projectControl.getPermittedProjects(this.user.projectPermissions);
    }

    loadAuthorizedEntities(){
        this.authorizedEntities = this.entityControl.getPermittedEntities(this.user.entityPermissions);
    }

}



module.exports={System_Path_Controller:System_Path_Controller};