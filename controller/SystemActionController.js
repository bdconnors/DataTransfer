class SystemActionController{

    constructor(){
        this.observers = [];
    }
    notify(userRequest){

    }
    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(authorization){

        this.observers.map(observer => observer.notify(authorization));

    }

}
module.exports={SystemActionController:SystemActionController};