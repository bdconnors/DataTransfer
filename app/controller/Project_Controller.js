class Project_Controller{

    constructor(repo){

        this.repo = repo;
    }

    getPermittedProjects(permissions){
        let userProjects = [];
        permissions.forEach(permission=>{
            userProjects.push(this.repo.getProject(permission.projectId));
        });
        return userProjects;
    }


}
module.exports = {Project_Controller:Project_Controller};