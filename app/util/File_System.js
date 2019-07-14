const fs = require('fs');
const rimraf = require('rimraf');
const fileTypes = require('mime-types');

class File_System{

    constructor(livePath,backupPath,errorLogPath,activityLogPath){
        this.livePath = livePath;
        this.backupPath = backupPath;
        this.errorLogPath = errorLogPath;
        this.activityLogPath = activityLogPath;
    }
    makeDirectory(path){
        fs.mkdirSync(this.livePath+path);
        fs.mkdirSync(this.backupPath+path);
    }
    appendActivityLog(activity){

        let stream = fs.createWriteStream(this.activityLogPath,{flags:'a'});

        stream.once('open',(fd)=>{

            activity.forEach((line)=>{
                stream.write(line);
            });

            stream.end();

        });

    }

    notify(action,values){

        if(action === 'CREATE PROJECT'){

            this.makeDirectory(values);

        }else if(action === 'USER INVITED'){

            let lines = [];

            lines.push('\t'+values.activity.date+': '+'\r\n');
            lines.push(

                '\r\n\t\t'+values.admin+' '
                +values.activity.action+' '
                +values.activity.target.firstname
                + ' '+values.activity.target.lastname
                +' to create an account.'
            );
            lines.push('\r\n\t\t'+'An email was sent by the system to '+values.activity.target.email+'.');

            this.appendActivityLog(lines);

        }

    }

}
module.exports = {File_System:File_System};