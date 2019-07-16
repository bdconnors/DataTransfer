const User = require('./User').User;

class User_Factory{

    constructor(projectFactory,storage){

        this.projectFactory = projectFactory;
        this.storage = storage;
        this.observers = [];
    }

    make(admin,firstname,lastname,email){
        return new User(admin,firstname,lastname,email);
    }
    convert(obj){

        let user = new User(obj.admin,obj.firstname,obj.lastname,obj.email);
        user.setId(obj.id);

        obj.projects.forEach((project)=>{

            if(!this.projectIntegrityCheck(project)) {

                for(let i = 0; obj.projects.length; i++){

                    if(obj.projects[i].id === project.id){

                        obj.projects.splice(i,1);

                    }
                }

            }else{

                user.addProject(this.projectFactory.convert(project))
            }

        });


        if(obj.authCode){

            user.setAuthCode(obj.authCode);
        }

        if(obj.phone){
            user.setPhone(obj.phone);
        }

        if(obj.password){
            user.setPassword(obj.password);
        }
        this.notifyAll('UPDATE USER',user);
        return user;
    }
    projectIntegrityCheck(project){
        return this.storage.folderExists(project.name);
    }
    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(action,values){

        this.observers.map(observer => observer.notify(action,values));

    }
}
module.exports={User_Factory:User_Factory};