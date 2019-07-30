class SystemViewController{

    constructor(){}

    load(authResponse){
        console.log(authResponse.variables);
        console.log('this is the user variable');
        if(authResponse.variables.user) {
            console.log(authResponse.variables.user);
        }
        authResponse.response.render('.'+authResponse.display,authResponse.variables);
    }
    redirect(authResponse){
        console.log(authResponse.display);
        authResponse.response.redirect(authResponse.display);
    }

    notify(authResponse){
        if(authResponse.command === 'DISPLAY') {
            this.load(authResponse);
        }else if(authResponse.command === 'REDIRECT'){
            this.redirect(authResponse);
        }
    }

}
module.exports={SystemViewController:SystemViewController};