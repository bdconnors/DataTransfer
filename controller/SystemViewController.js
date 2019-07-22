class SystemViewController{

    constructor(){}

    load(authorization){
        let path = authorization.path;
        let variables = authorization.variables;
        authorization.res.render('.'+path,variables);
    }

    notify(authorization){
        this.load(authorization);
    }

}
module.exports={SystemViewController:SystemViewController};