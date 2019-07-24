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
                authResponse.variables.email = {action:'INVITE USER',user:user};
                this.notifyAll(authResponse);
            })
            .catch(err=>{throw err});
    }
    notify(authResponse){
        if(authResponse.command === 'ACTION'){
            if(authResponse.display === '/users/invite'){
                this.inviteNewUser(authResponse).catch((err)=>{throw err});
            }
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