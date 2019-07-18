class Permission_Repo {

    constructor(permissionFactory) {
        this.permissionFactory = permissionFactory;
        this.permissions = [];
        this.observers = [];
    }
    load(permissions){

        permissions.forEach(permission=>{
           this.permissions.push(this.convert(permission));
        });
    }
    convert(obj){

        let entityId = false;

        if(obj.entityId){ entityId = obj.entityId;}

        return this.permissionFactory.make(obj.userId,obj.projectId,entityId,obj.view,obj.edit,obj.upload,obj.download);

    }
    subscribe(obs) {
        this.observers.push(obs);
    }

    notifyAll(action, values) {

        this.observers.map(observer => observer.notify(action, values));

    }
}
module.exports={Permission_Repo:Permission_Repo};