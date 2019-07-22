class Entity_Controller{

    constructor(repo){
        this.repo = repo;
    }
    getPermittedProjectEntities(permissions){

    }
    getProjectEntities(projectid){
        return this.repo.getProjectEntities(projectid);
    }
    getPermittedEntities(permissions){

        return this.repo.getPermittedEntities(permissions);
    }

}
module.exports = {Entity_Controller:Entity_Controller};