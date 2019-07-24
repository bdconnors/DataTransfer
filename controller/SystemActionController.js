class SystemActionController{

    constructor(userControl,projectControl){
        this.userControl = userControl;
        this.projectControl = projectControl;
        this.observers = [];
    }
    async inviteNewUser(authResponse){
        let admin = authResponse.request.body.admin;
        let firstname = authResponse.request.body.firstname;
        let lastname = authResponse.request.body.lastname;
        let email = authResponse.request.body.email;
        this.userControl.inviteNewUser(admin,firstname,lastname,email)
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
    performAction(authResponse){

        if(authResponse.display === '/users/invite'){
            this.inviteNewUser(authResponse).catch((err)=>{throw err});
        }else if(authResponse.display === '/users/authenticate'){
            this.updateNewUser(authResponse).catch((err)=>{throw err});
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