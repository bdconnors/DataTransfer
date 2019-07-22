class System_Action_Controller{

    constructor(){
        this.observers = [];
    }
    /** POST Requests **/
    postLogIn(req,res){
        this.notifyAll('POST LOGIN',req,res)
    }
    postLogOut(req,res){
        req.session.destroy();
        res.redirect('/login');
    }
    postInvite(req,res){
        this.notifyAll('POST INVITE',req,res);
    }
    postNewUserAuth(req,res){
        this.notifyAll('POST NEW USER AUTH',req,res);
    }
    postCreatProject(req,res){
        this.notifyAll('POST CREATE PROJECT',req,res);
    }

    /** GET Requests **/
    getLogin(req,res){
        this.notifyAll('GET LOGIN',req,res);
    }
    getDashboard(req,res){
        this.notifyAll('GET DASHBOARD',req,res);
    }
    getInviteForm(req,res){
        this.notifyAll('GET INVITE',req,res);
    }
    getNewUserAuth(req,res){
        this.notifyAll('GET NEW USER AUTH',req,res);
    }
    getUserProfile(req,res){
        this.notifyAll('GET USER PROFILE',req,res);
    }
    getProject(req,res){
        this.notifyAll('GET PROJECT',req,res);
    }
    getCreateProject(req,res){
        this.notifyAll('GET CREATE PROJECT',req,res);
    }
    getUnAuthorized(req,res){
        this.notifyAll('UNAUTHORIZED',res,res);
    }

    /** System CRUD Methods **/
    createNewUser(req,res,userControl){
        console.log('INSIDE CREATE NEW USER');
        let accountType = req.body.admin;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let email = req.body.email;
        let user = userControl.inviteNewUser(accountType,firstname,lastname,email);
        console.log(user);
        this.notifyAll('USER INVITED',req,res,user);
    }
    authenticateNewUser(req,res,values){
        let phone = req.body.phone;
        let password = req.body.password;
        let userControl = values.userControl;
        let user =  values.user;
        let newUser = userControl.updateNewUser(user,phone,password);
        this.notifyAll('NEW USER AUTHENTICATED',req,res,newUser);
    }
    createNewProject(req,res,controllers){
        let projectControl = controllers.projectControl;
        let obj = Object.keys(req.body);
        let permissions = [];
        for(let i = 1; i < obj.length; i++){
            let permission = {};
            permission.id = obj[i];
            permission.permission = req.body[obj[i]];
            permissions.push(permission);
        }
        let project = projectControl.createNewProject(req.body.name);
        this.notifyAll('NEW PROJECT',req,res,{projectId:project.id,permissions:permissions});
    }

    /** Observer/Observable Methods **/
    notify(message,req,res,values){
        console.log(message);
        if(message === 'POST INVITE AUTHORIZED'){
            this.createNewUser(req,res,values);
        }else if(message === 'POST NEW USER EXISTS'){
            this.authenticateNewUser(req,res,values);
        }else if(message === 'POST CREATE PROJECT AUTHORIZED'){
            this.createNewProject(req,res,values);
        }
    }
    subscribe(obs){
        this.observers.push(obs);
    }
    notifyAll(message,req,res,values){

        this.observers.map(observer => observer.notify(message,req,res,values));

    }

}
module.exports={System_Action_Controller:System_Action_Controller};