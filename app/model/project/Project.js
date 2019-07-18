const uuid = require('uuid');
class Project{

    constructor(name){
        this.id = uuid();
        this.name = name;
        this.entitys = [];
    }

    addEntity(entity){ this.entitys.push(entity); }
    retrieveEntity(id){

        let entity = false;

        this.entitys.forEach((ent)=>{

            if(entity.id === id){ entity = ent; }

        });

        return entity;
    }
    updateEntity(id,newEntity){

        let oldEntity = false;


        for(let i = 0; i < this.entitys.length; i++) {

            if (this.entitys[i].id === id) {

                oldEntity = this.entitys[i];
                this.entitys[i] = newEntity;

            }
        }

        return oldEntity;
    }
    deleteEntity(id){

        let entity = false;

        for(let i = 0; i < this.entitys.length; i++){

            if(this.entitys[i].id === id) {

                entity = this.entitys[i];
                this.entitys.splice(i, 1);
            }

        }

        return entity;

    }

}
module.exports = {Project:Project};