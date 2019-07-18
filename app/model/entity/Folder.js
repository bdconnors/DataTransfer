const Entity = require('./Entity').Entity;

class Folder extends Entity{

    constructor(id,projectId,dir,name,author){

        super(id,projectId,dir,name,author,true);
        this.children = [];

    }

   addChild(id){

        this.children.push(id);

   }
   getChild(id){

        let child = false;

        this.children.forEach(childId =>{

            if(childId === id){

                child = childId;
            }

        });

        return child;
   }
   updateChild(id,newId){

        let oldChild = false;

        for(let i = 0; i < this.children.length; i++){

            if(this.children[i] === id){

                oldChild = this.children[i];
                this.children[i] = newId;
            }

        }

        return oldChild;
   }
   deleteChild(id){

        let child = false;

        for(let i = 0; i < this.children.length; i++){

            if(this.children[i] === id){

                child = this.children[i];
                this.children.splice(i,1);

            }

        }

        return child;


   }

}
module.exports = {Folder:Folder};