class User_Project_Service{

    constructor(userRepo,projectFactory,storage){
        this.userRepo = userRepo;
        this.projectFactory = projectFactory;
        this.storage = storage;
    }

    addProject(email,name,read,write,entitys){

        let success = this.userRepo.getUser(email);

        if(success){ success = success.addProject(this.projectFactory.make(name,read,write,entitys));}

        return success;

    }
    getProjects(email){

        let success = this.userRepo.getUser(email);

        if(success){ success = success.getProjects(); }

        return success;
    }
    removeProject(email,projectName){

        let success = this.userRepo.getUser(email);

        if(success){ success = success.deleteProject(projectName);}

        return success;

    }
}
module.exports = {User_Project_Service:User_Project_Service};