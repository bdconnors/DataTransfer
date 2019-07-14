class System_Controller{

    constructor(userRepo){
        this.userRepo = userRepo;
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

                this.displayDashboard(req,res);
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
                let userPermissions = [];

                if(req.body.users) {

                    if (typeof req.body.users === 'object') {

                        for (let i = 0; i < users.length; i++) {

                            let curUser = users[i];
                            let curPermission = {id: curUser, permission: req.body[curUser]};
                            userPermissions.push(curPermission);
                        }

                    } else {

                        userPermissions.push({id: users, permission: req.body[users]});

                    }

                }

                this.userRepo.addNewProject(projectName,userPermissions);
                this.displayDashboard(req,res);

            }else{

                res.send('Accessed Denied');

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

    authenticateNewUser(req,res){

        if(this.userRepo.getUserBy('authCode',req.query.authcode)) {

            if (this.userRepo.newUserUpdate(req.query.authcode, req.body.phone, req.body.password)) {
                
                let user = this.userRepo.getUserBy('phone',req.body.phone);
                this.displayAuthSuccess('./users/authSuccess', {name:user.getFullName(),email:user.getEmail()});
                
            }else{
                
                res.send('server error could update');
                
            }
            
        }else{
            
            res.send('server error user not found');
            
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

        let user = this.userRepo.getUserBy('authCode',req.query.authcode);
        res.render('./users/auth',{name:user.getFullName()});

    }

    displayAuthSuccess(req,res){


         let user = this.userRepo.newUserUpdate(req.query.authCode,req.body.phone,req.body.password);
         if(user) {
             res.render('./user/inviteSuccess', {name: user.getFullName(), email: user.getEmail()});
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
