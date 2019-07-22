class System_View_Controller{

    constructor(){
        this.system = {};
    }

    /** System Displays **/
    serveLogin(req,res){
        res.render('./login/login');
    }
    serveDashboard(req,res){
       res.render('./dashboard/dashboard',{system:this.system})
    }
    serveInviteForm(req,res){
        res.render('./users/invite',{system:this.system});
    }
    serveInviteSuccess(req,res,user){
        let account;
        console.log(user.admin);
        if(user.admin === 'false'){
            account = 'Standard';
        }else{
            account = 'Administrator';
        }
        res.render('./users/inviteSuccess',{system:this.system,name:user.getFullName(),email:user.email,account:account});
    }
    serveNewUserAuthForm(req,res,user){
        res.render('./users/auth',{name:user.getFullName()});
    }
    serveNewUserAuthSuccess(req,res,user){
        res.render('./users/authSuccess',{name:user.getFullName(),email:user.email});
    }
    serveUserProfile(req,res,user){
        res.render('./users/userProfile',{system:this.system,user:user})
    }
    serveProject(req,res,values){
        res.render('./projects/project',{system:this.system,project:values.project,entities:values.entities});
    }
    serveCreateProjectForm(req,res){
        res.render('./projects/add',{system:this.system})
    }
    /** Error Pages**/
    serveLoginFail(req,res,values){
        res.render('./login/fail',values);
    }

    serveUnAuthorized(req,res){
        res.send('Un-Authorized User Action');
    }



    /** Redirects **/
    redirectToDashboard(req,res){
        res.redirect('/dashboard');
    }
    redirectToLogin(req,res){
        res.redirect('/login');
    }
    redirectToUnAuthorized(req,res){
        res.redirect('/unauthorized');
    }

    setSystemValues(values){
        this.system.user = values.user;
        this.system.users = values.systemUsers;
        this.system.projects = values.projects;
        this.system.folders = values.folders;
        this.system.files = values.files;
    }

    notify(message,req,res,values){

        if(message === 'GET LOGIN'){
            this.serveLogin(req,res);
        }else if(message === 'LOGIN FAILED'){
            this.serveLoginFail(req,res,values);
        }else if(message === 'LOGIN SUCCESSFUL'){
            this.setSystemValues(values);
            this.redirectToDashboard(req,res);
        }else if(message === 'USER INVITED'){
            this.serveInviteSuccess(req,res,values);
        }else if(message === 'GET NEW USER EXISTS'){
            console.log(values);
            this.serveNewUserAuthForm(req,res,values);
        }else if(message === 'NEW USER AUTHENTICATED'){
            this.serveNewUserAuthSuccess(req,res,values);
        }else if(message === 'GET USER PROFILE AUTHORIZED'){
            this.serveUserProfile(req,res,values);
        }else if(message === 'USER LOGGED OUT'){
            this.redirectToLogin(req,res);
        }else if(message === 'GET DASHBOARD AUTHORIZED'){
            this.serveDashboard(req,res);
        }else if(message === 'GET INVITE AUTHORIZED'){
            this.serveInviteForm(req,res);
        }else if(message === "GET CREATE PROJECT AUTHORIZED"){
            this.serveCreateProjectForm(req,res);
        }else if(message === 'NEW PROJECT'){
            this.redirectToDashboard(req,res);
        }else if(message === 'GET PROJECT AUTHORIZED'){
            this.serveProject(req,res,values);
        }else if(message === 'BAD SESSION'){
            this.redirectToLogin(req,res);
        }else if(message === 'UNAUTHORIZED'){
            this.redirectToUnAuthorized(req,res);
        }

    }
}



module.exports={System_Path_Controller:System_View_Controller};