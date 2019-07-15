/** App Components **/
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors  = require('cors');
const uuid = require('uuid');

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
const entityFactory = new Entity_Factory(storage);

const Activity_Factory = require('./model/activity/Activity_Factory').Activity_Factory;
const activityFactory = new Activity_Factory();

const Project_Factory = require('./model/project/Project_Factory').Project_Factory;
const projectFactory = new Project_Factory(entityFactory,storage);

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

        userFactory = new User_Factory(projectFactory,activityFactory,storage);
        userFactory.subscribe(db);

        userRepo = new User_Repo(userFactory,projectFactory,entityFactory);
        userRepo.load(res);

        console.log(userRepo.users);

        system = new System_Controller(userRepo,storage);
        system.subscribe(mailer);
        system.subscribe(storage);

        user = new User_Action_Controller(system);
        userRepo.subscribe(db);
        userRepo.subscribe(storage);

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

    user.requestUserDashboard(req,res);

});

app.get('/projects',(req,res)=>{

    user.requestProjectsIndex(req,res);

});

app.get('/projects/project/:id',(req,res)=>{

    user.requestProject(req,res);

});

app.get('/projects/add',(req,res)=>{

    user.requestCreateProjectForm(req,res);

});

app.post('/projects/add',(req,res)=>{

    user.createProject(req,res);
});

app.get('/projects/new/folder',(req,res)=>{

    user.requestAddFolder(req,res);
});

app.post('/projects/new/folder',(req,res)=>{

    user.addFolder(req,res);
});

app.get('/projects/files/upload',(req,res)=>{

    user.requestUpload(req,res);

});

app.post('/projects/files/upload',(req,res)=>{

    user.uploadFile(req,res);

});
app.get('/projects/project/:id/files',(req,res)=>{

    user.requestFile(req,res);

});

app.get('/users',(req,res)=>{

    res.send('Users Index');
});

app.get('/users/invite',(req,res)=>{

    user.requestInviteUserForm(req,res)

});

app.post('/users/invite',(req,res)=>{

    user.inviteUser(req,res);

});

app.get('/users/authenticate',(req,res)=>{

    system.displayUserAuthForm(req,res);
});

app.post('/users/authenticate',(req,res)=>{

    system.authenticateNewUser(req,res);

});

