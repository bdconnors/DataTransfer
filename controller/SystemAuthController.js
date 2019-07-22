const Authorization= require('../model/Authorization').Authorization;

class SystemAuthController{

    constructor(userControl){
        this.userControl = userControl;
        this.observers=[];
    }


    getLogin(req,res){

        let authorization = this.make(req,res);
        authorization.authorized = true;
        this.notifyAll(authorization);

    }
    postLogin(req,res){
        this.userControl.verifyCredentials(req.body.email,req.body.password).then(res=>{console.log(res)}).catch(err=>{throw err});
    }

    adminAuth(req,res){

    }
    sessionAuth(req,res){

    }
    make(req,res){

        let path = req.route.path;
        let method = this.getMethodType(req);

        return new Authorization(path, method, res);
    }
    getMethodType(req){
        let method;
        if(req.route.methods.get){
            method = 'GET';
        }else if(req.route.methods.post){
            method = 'POST'
        }
        return method;
    }


    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(authorization){

        this.observers.map(observer => observer.notify(authorization));

    }

}
module.exports={SystemAuthController:SystemAuthController};