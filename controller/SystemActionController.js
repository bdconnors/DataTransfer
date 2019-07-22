class SystemActionController{

    constructor(userControl,projectControl){
        this.userControl = userControl;
        this.projectControl = projectControl;
        this.observers = [];
    }

    notify(authResponse){

        if(authResponse.command === 'ACTION'){

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