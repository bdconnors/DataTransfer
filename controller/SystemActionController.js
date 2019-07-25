class SystemActionController{

    constructor(userControl,projectControl){
        this.userControl = userControl;
        this.projectControl = projectControl;
        this.observers = [];
    }
    async inviteNewUser(authResponse){
        let firstname = authResponse.request.query.firstname;
        let lastname = authResponse.request.query.lastname;
        let email = authResponse.request.query.email;
        this.userControl.inviteNewUser(firstname,lastname,email)
            .then((user)=>{
                authResponse.display = '/users/inviteSuccess';
                authResponse.variables.email = {action:'INVITED',user:user};
                this.notifyAll(authResponse);
            })
            .catch(err=>{throw err});
    }
    async updateNewUser(authResponse){
        let authCode = authResponse.request.query.authCode;
        let phone = authResponse.request.body.phone;
        let password = authResponse.request.body.password;
        this.userControl.updateNewUser(authCode,phone,password)
            .then(user=>{
                authResponse.display = '/users/authSuccess';
                authResponse.variables.email = {action:'AUTHENTICATED',user:user};
                this.notifyAll(authResponse);
            })
            .catch((err)=>{throw err});
    }
    async getAllUsers(authResponse){

        let users = await this.userControl.getAllUsers();
        authResponse.response.send(users);

    }
    async getProjectUsers(authResponse){
        if(authResponse.request.query.id){
            let id = authResponse.request.query.id;
            let projectUsers = await this.userControl.getProjectUsers(id);
            authResponse.response.send(projectUsers);
        }
    }

    async createNewProject(authResponse){
        let name = authResponse.request.body.name;
        this.projectControl.createNewProject(name).then((project)=>{
            console.log(project);
            authResponse.response.send(project);
        }).catch(err=>{
            console.log(err);
            authResponse.response.send(err);
        });
    }
    performAction(authResponse){

        if(authResponse.display === '/users/invite'){
            this.inviteNewUser(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/users/authenticate'){
            this.updateNewUser(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/projects/create'){
            this.createNewProject(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/users'){
            this.getAllUsers(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/users/project'){
            this.getProjectUsers(authResponse).catch((err)=>{throw err});
        }

    }
    notify(authResponse){
        if(authResponse.command === 'ACTION'){
            this.performAction(authResponse);
        }
    }
    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(authResponse){

        this.observers.map(observer => observer.notify(authResponse));

    }

}
module.exports={SystemActionController:SystemActionController};