class Entity_Repo {

    constructor(entityFactory) {
        this.entityFactory = entityFactory;
        this.entities =[];
        this.observers = [];
    }

    getEntity(id){

        let entity = false;

        this.entities.forEach(ent=>{
            if(ent.id === id){
                entity = ent;
            }
        });

        return entity;

    }
    load(entities){

        entities.forEach(entity=>{
            this.entities.push(this.convert(entity));
        });
    }
    convert(obj){

        let entity = this.entityFactory.make(obj.projectId,obj.dir,obj.name,obj.author,obj.isFolder);
        entity.id = obj.id;

        obj.parents.forEach(parent=>{
            entity.addParent(parent);
        });

        if(obj.children){
            entity.children.forEach(child=>{
                entity.addChild(child);
            });
        }
        entity.getSize();
        entity.getCreated();
        entity.getModified();
        entity.getAccessed();
        return entity;

    }
    subscribe(obs) {
        this.observers.push(obs);
    }

    notifyAll(action, values) {

        this.observers.map(observer => observer.notify(action, values));

    }
}
module.exports={Entity_Repo:Entity_Repo};