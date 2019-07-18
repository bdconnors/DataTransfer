/** App Components **/
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors  = require('cors');
const uuid = require('uuid');
const path = require('path');

/** Use Express for App Engine and listen on port 80**/
const app = express();
app.listen(80, () => console.log(`listening on port 80`));

/** Use ejs for View Engine **/
app.set('view engine','ejs');
app.use( express.static( "view" ));
app.set("views", "view");

/** Use Body Parser to parse HTML post data **/
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb'}));
app.use(bodyParser.json());

/** Use CORS for Cross Origin Requests **/
app.use(cors());


/** Use Express Session to Create User Sessions **/
app.use(session({
    genid: (req)=>{
        return uuid();
    },
    secret: 'ProjectSapphire',
    resave: true,
    saveUninitialized: true,
    name: 'session',
    secure: false,
    rolling: true,
    cookie: { maxAge: 3600000 }
}));


/** Database Info **/
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'novvdr';


/** Database Actions**/
const Database = require('./util/Database').Database;
const db = new Database(url,dbName);

/** Local Storage Paths **/
const storagePathLive = '/home/brandon/DataTransfer/docs/live/';
const storagePathBackup = '/home/brandon/DataTransfer/docs/backup/';
const errorLogPath = '/home/brandon/DataTransfer/logs/error_log.txt';
const activityLogPath = '/home/brandon/DataTransfer/logs/activity_log.txt';

/** Local Storage Access **/
const File_System = require('./util/File_System').File_System;
const storage = new File_System(storagePathLive,storagePathBackup,errorLogPath,activityLogPath);


/** System Mailer **/
const System_Mailer = require('./util/System_Mailer').System_Mailer;
const mailer = new System_Mailer('gmail','system.novitious@gmail.com','Rubix123');


/** User Repository **/
const User_Repo = require('./model/User_Repo').User_Repo;
let userRepo;


/** Factories **/
const Entity_Factory = require('./model/entity/Entity_Factory').Entity_Factory;
const entityFactory = new Entity_Factory();

const Activity_Factory = require('./model/activity/Activity_Factory').Activity_Factory;
const activityFactory = new Activity_Factory();

const Project_Factory = require('./model/project/Project_Factory').Project_Factory;
const projectFactory = new Project_Factory(entityFactory);

const User_Factory = require('./model/user/User_Factory').User_Factory;
let userFactory;


/** Controllers **/
const System_Controller = require('./controller/System_Controller').System_Controller;
let system;

const User_Action_Controller = require('./controller/User_Action_Controller').User_Action_Controller;
let user;


/** Connect to Database and load Internal Data Structures **/
db.connect().then(()=>{

    db.retrieveDocuments('users',{},{'_id':0}).then((res)=>{

        userFactory = new User_Factory(projectFactory);

        userRepo = new User_Repo(userFactory,projectFactory,entityFactory);
        userRepo.load(res);


        console.log(userRepo.users);

        system = new System_Controller(userRepo,storage);
        system.subscribe(mailer);


        user = new User_Action_Controller(system);
        userRepo.subscribe(db);
        userRepo.subscribe(storage);
        userRepo.subscribe(system)

    }).catch((err)=>{
        throw err
    });

}).catch((err)=>{
    throw err
});


/** Routes **/

app.get('/',(req,res)=>{

    system.displayLogin(req,res)

});

app.post('/',(req,res)=> {

   user.signIn(req,res);

});

app.get('/logout',(req,res)=>{

    user.signOut(req,res);

});

app.get('/dashboard',(req,res)=>{

    user.userDashboard(req,res);

});

app.get('/users/invite',(req,res)=>{

    user.inviteUserForm(req,res)

});

app.post('/users/invite',(req,res)=>{

    user.inviteUser(req,res);

});

app.get('/users/authenticate',(req,res)=>{

    system.displayAuthenticationForm(req,res);
});

app.post('/users/authenticate',(req,res)=>{

    system.authenticate(req,res);

});

app.get('/users/user/:id',(req,res)=>{

    user.userProfile(req,res);

});

app.get('/users/delete',(req,res)=>{

    res.send('delete user');

});

app.get('/projects',(req,res)=>{

    user.projectsIndex(req,res);

});

app.get('/projects/project/:id',(req,res)=>{

    user.viewProject(req,res);

});

app.get('/projects/newproject',(req,res)=>{

    user.createProjectForm(req,res);

});

app.post('/projects/newproject',(req,res)=>{

    user.createProject(req,res);
});


app.get('/projects/project/:id/upload',(req,res)=>{

    user.projectUploadForm(req,res);

});

app.post('/projects/project/:id/upload',(req,res)=>{

    user.uploadToProject(req,res);

});
app.post('/projects/project/:id/delete',(req,res)=>{

    user.deleteProject(req,res);

});

app.get('/projects/project/:id/rename',(req,res)=>{

    user.projectRenameForm(req,res);

});

app.post('/projects/project/:id/rename',(req,res)=>{

    user.renameProject(req,res)

});

app.get('/projects/project/:id/permissions',(req,res)=>{

    user.projectPermissionsForm(req,res);

});

app.post('/projects/project/:id/permissions',(req,res)=>{

    user.updateProjectPermissions(req,res);

});

app.get('/projects/project/:id/files/inline/:fileid',(req,res)=>{

    user.viewFile(req,res);

});

app.get('/projects/project/:id/files/attachment/:fileid',(req,res)=>{

    user.downloadFile(req,res);

});

app.post('/projects/project/:id/files/:fileid/delete',(req,res)=>{

    user.deleteFile(req,res);

});
app.get('/projects/project/:id/files/:fileid/permissions',(req,res)=>{

    user.filePermissionsForm(req,res);

});
app.get('/projects/project/:id/files/:fileid/permissions',(req,res)=>{

    res.send(req.body);

});
app.get('/projects/project/:id/files/:fileid/rename',(req,res)=>{

    user.fileRenameForm(req,res);

});
app.post('/projects/project/:id/files/:fileid/rename',(req,res)=>{

    user.renameFile(req,res);

});

app.get('/projects/project/:id/folders/new',(req,res)=>{

    user.addFolderForm(req,res);
});

app.post('/projects/project/:id/folders/new',(req,res)=>{

    user.addFolder(req,res);
});

app.post('/projects/project/:id/folders/delete',(req,res)=>{

    user.deleteFolder(req,res);

});
app.get('/projects/project/:id/folders/folder/:folderid',(req,res)=>{

    user.viewFolder(req,res);

});
app.get('/projects/project/:id/folders/folder/:folderid/upload',(req,res)=>{

    user.folderUploadForm(req,res);

});
app.post('/projects/project/:id/folders/folder/:folderid/upload',(req,res)=>{

    user.uploadToFolder(req,res);

});
app.get('/projects/project/:id/folders/folder/:folderid/rename',(req,res)=>{

    user.folderRenameForm(req,res);

});
app.post('/projects/project/:id/folders/folder/:folderid/rename',(req,res)=>{

    user.renameFolder(req,res);

});

app.get('/projects/project/:id/folders/folder/:folderid/permissions',(req,res)=>{

    user.folderPermissionsForm(req,res);

});
app.post('/projects/project/:id/folders/folder/:folderid/permissions',(req,res)=>{

    res.send(req.body);

});


