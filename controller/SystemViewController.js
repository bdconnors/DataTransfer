class SystemViewController{

    constructor(){}

    load(authResponse){
        if(authResponse.variables.projects){
            console.log(authResponse.variables.projects);
        }
        console.log(authResponse.variables);
        authResponse.response.render('.'+authResponse.display,authResponse.variables);
    }
    redirect(authResponse){
        authResponse.response.redirect(authResponse.display);
    }

    notify(authResponse){
        if(authResponse.command === 'DISPLAY') {
            console.log(authResponse.display);
            this.load(authResponse);
        }else if(authResponse.command === 'REDIRECT'){
            this.redirect(authResponse);
        }
    }

}
module.exports={SystemViewController:SystemViewController};