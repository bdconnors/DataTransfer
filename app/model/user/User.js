const uuid = require('uuid');
const bcrypt = require('bcrypt');

class User{

    constructor(admin,firstname,lastname,email){

        this.id = uuid();
        this.admin = admin;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.projects = [];
        this.activity =[];

    }

    addProject(project){ this.projects.push(project); }

    retrieveProject(id){

        let success = false;

        this.projects.forEach((project)=>{

            if(project.id === id){
                success = project;
            }

        });

        return success;
    }

    updateProject(name,field,value){

        let success = false;

        this.projects.forEach((project)=>{

            if(project.name === name){
                project[field] = value;
                success = project;
            }

        });

        return success;

    }
    deleteProject(name){

        let success = false;

        for(let i= 0; i < this.projects.length; i++){

            if(this.projects[i].name === name){

                success = this.projects[i];
                this.projects.splice(i,1);

            }

        }

        return success;
    }

    addActivity(activity){ this.activity.push(activity); }

    retrieveActivity(id){

        let success = false;

        this.activity.forEach((activity)=>{

            if(activity.id === id){
                success = activity;
            }

        });

        return success;
    }

    updateActivity(id,field,value){

        let success = false;

        this.activity.forEach((activity)=>{

            if(activity.id === id){
                activity[field] = value;
                success = activity;
            }

        });

        return success;

    }

    deleteActivity(id){

        let success = false;

        for(let i= 0; i < this.activity.length; i++){

            if(this.activity[i].id === id){

                this.activity.splice(i,1);
                success = this.activity[i];

            }

        }

        return success;
    }

    getId(){ return this.id; }
    setId(id){ this.id = id; }

    getAdmin(){ return this.admin; }
    setAdmin(admin){ this.admin = admin; }

    getFirstName(){ return this.firstname; }
    setFirstName(firstname){ this.firstname = firstname; }

    getLastName(){ return this.lastname; }
    setLastName(lastname){ this.lastname = lastname; }

    getFullName(){ return this.firstname+' '+this.lastname; }

    getEmail(){ return this.email; }
    setEmail(email){ this.email = email; }

    getPhone(){ return this.phone; }
    setPhone(phone){ this.phone = phone }

    getPassword(){ return this.password; }
    setPassword(password){ this.password = password}
    setHashPassword(password){ this.password = bcrypt.hashSync(password,12); }
    verifyPassword(password){
        return bcrypt.compareSync(password,this.password)
    }

    getProjects(){ return this.projects; }
    setProjects(projects){ this.projects = projects; }

    getActivity(){ return this.activity; }
    setActivity(activity){ this.activity = activity; }

    getAuthCode(){ return this.authCode; }
    setAuthCode(authCode){ this.authCode = authCode; }
    addAuthCode(){this.authCode = uuid()}
    deleteAuthCode(){ delete this.authCode; }

}
module.exports = {User : User};