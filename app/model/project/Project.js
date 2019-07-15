class Project{

    constructor(id,name,read,write){
        this.id = id;
        this.name = name;
        this.read = read;
        this.write = write;
        this.entitys = [];
    }

    addEntity(entity){ this.entitys.push(entity); }
    retrieveEntity(id){

        let success = false;

        this.entitys.forEach((entity)=>{

            if(entity.id === id){ success = entity; }

        });

        return success;
    }
    updateEntity(id,field,value){

        let success = false;

        this.entitys.forEach((entity)=>{

            if(entity.id === id){ entity[field] = value; }

        });

        return success;

    }
    deleteEntity(id){

        let success = false;

        for(let i = 0; i < this.entitys.length; i++){

            if(this.entitys[i].id === id) {

                success = this.entitys[i];
                this.entitys.splice(i, 1);
            }

        }

        return success;

    }

    getId(){ return this.id; }
    setId(id){
        console.log('Param Id in Proj Model: '+id);
        this.id = id;
        console.log('Id in Proj Model: '+this.id);

    }

    getName(){ return this.name; }
    setName(name){ this.name = name; }

    getRead(){ return this.read; }
    setRead(read){ this.read = read; }

    getWrite(){ return this.write; }
    setWrite(write){ this.write = write; }

    getEntitys(){ return this.entitys; }
    setEntitys(entitys){ this.entitys = entitys; }

}
module.exports = {Project:Project};