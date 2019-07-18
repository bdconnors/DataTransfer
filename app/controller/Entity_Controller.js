class Entity_Controller{

    constructor(repo){
        this.repo = repo;
    }

    getPermittedEntities(permissions){

        let permittedEntities = [];

        permissions.forEach(permission=>{

            permittedEntities.push(this.repo.getEntity(permission.entityId));

        });

        return permittedEntities;

    }

}
module.exports = {Entity_Controller:Entity_Controller};