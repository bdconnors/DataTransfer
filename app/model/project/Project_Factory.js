const Project = require('./Project').Project;

class Project_Factory {

    constructor(){}

    make(name){

        return new Project(name);

    }

}
module.exports={Project_Factory:Project_Factory};