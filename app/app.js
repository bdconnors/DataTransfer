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


/** Repositories (Observables) **/
const User_Repo = require('./model/repos/User_Repo').User_Repo;
let userRepo;

const Project_Repo = require('./model/repos/Project_Repo').Project_Repo;
let projectRepo;

const Entity_Repo = require('./model/repos/Entity_Repo').Entity_Repo;
let entityRepo;

const Permission_Repo = require('./model/repos/Permission_Repo').Permission_Repo;
let permissionRepo;

/** Observers **/
const User_Observer = require('./model/repos/observers/User_Observer').User_Observer;
let userObs;

const Project_Observer = require('./model/repos/observers/Project_Observer').Project_Observer;
let projectObs;

const Entity_Observer = require('./model/repos/observers/Entity_Observer').Entity_Observer;
let entityObs;

const Permissions_Observer = require('./model/repos/observers/Permission_Observer').Permission_Observer;
let permissionObs;

/** Factories **/
const User_Factory = require('./model/user/User_Factory').User_Factory;
let userFactory = new User_Factory();

const Project_Factory = require('./model/project/Project_Factory').Project_Factory;
let projectFactory = new Project_Factory();

const Entity_Factory = require('./model/entity/Entity_Factory').Entity_Factory;
let entityFactory = new Entity_Factory();

const Permission_Factory = require('./model/permissions/Permission_Factory').Permission_Factory;
let permissionFactory = new Permission_Factory();


/** Controllers **/
const Entity_Controller = require('./controller/Entity_Controller').Entity_Controller;
let entityControl;

const Permission_Controller = require('./controller/Permission_Controller').Permission_Controller;
let permissionControl;

const Project_Controller = require('./controller/Project_Controller').Project_Controller;
let projectControl;

const User_Controller = require('./controller/User_Controller').User_Controller;
let userControl;

const User_Action_Controller = require('./controller/User_Action_Controller').User_Action_Controller;
let user;

const System_Authorization_Controller = require('./controller/System_Authorization_Controller').System_Authorization_Controller;
let sysAuth;

const System_Path_Controller = require('./controller/System_Path_Controller').System_Path_Controller;
let sysPath;

const System_Action_Controller = require('./controller/System_Action_Controller').System_Action_Controller;
let sys;


/** Connect to Database and load Internal Data Structures **/
db.connect().then((mongo)=>{

    userObs = new User_Observer(mongo);
    projectObs = new Project_Observer(mongo);
    entityObs = new Entity_Observer(mongo);
    permissionObs = new Permissions_Observer(mongo);

    entityObs.get({}).then(res=>{

        entityRepo = new Entity_Repo(entityFactory);
        entityRepo.load(res);
        entityRepo.subscribe(entityObs);
        console.log(entityRepo.entities);

        permissionObs.get({}).then(res=>{

            permissionRepo = new Permission_Repo(permissionFactory);
            permissionRepo.load(res);
            permissionRepo.subscribe(permissionObs);
            console.log(permissionRepo.permissions);

            projectObs.get({}).then(res=>{

                projectRepo = new Project_Repo(projectFactory);
                projectRepo.load(res);
                projectRepo.subscribe(projectObs);
                console.log(projectRepo.projects);

                userObs.get({}).then(res=>{

                    userRepo = new User_Repo(userFactory);
                    userRepo.load(res);
                    userRepo.subscribe(userObs);
                    console.log(userRepo.users);

                    entityControl = new Entity_Controller(entityRepo);
                    permissionControl = new Permission_Controller(permissionRepo);
                    projectControl = new Project_Controller(projectRepo);
                    userControl = new User_Controller(userRepo);

                    sysPath = new System_Path_Controller(projectControl,entityControl);
                    sys = new System_Action_Controller(sysPath,mailer,storage);
                    sysAuth = new System_Authorization_Controller(sys,userControl,permissionControl);

                    user = new User_Action_Controller(sysAuth);

                }).catch(err=>{throw err});

            }).catch(err=>{throw err});

        }).catch(err=>{throw err});

    }).catch(err=>{throw err});

}).catch((err)=>{throw err});


/** Routes **/

app.get('/',(req,res)=>{

    sys.redirectToLogin(req,res);

});

app.get('/login',(req,res)=>{

    sys.serveLogin(req,res)

});

app.post('/login',(req,res)=> {

   user.logIn(req,res)

});

app.get('/logout',(req,res)=>{

    user.logOut(req,res);

});

app.get('/unauthorized',(req,res)=>{

    sys.serveUnAuthorized(req,res);

});

app.get('/dashboard',(req,res)=>{

    user.requestUserDashboard(req,res);

});

app.get('/users/invite',(req,res)=>{

    user.requestInviteForm(req,res);

});

app.post('/users/invite',(req,res)=>{

    user.inviteUser(req,res);

});

/**app.get('/users/authenticate',(req,res)=>{

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

});**/


