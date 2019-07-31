/** App Components **/
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors  = require('cors');
const uuid = require('uuid');

/** Use Express for App Engine and listen on port 80**/
const app = express();
app.listen(88, () => console.log(`listening on port 80`));

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

/** Database**/
const Database = require('./model/Database');
const db = Database.db;
const dbUserAccess = Database.User;
const dbProjectAccess = Database.Project;

/** Model **/
const ProjectsRepo= require('./model/ProjectsRepo').ProjectsRepo;
const Projects = new ProjectsRepo(dbProjectAccess);

const UsersRepo = require('./model/UsersRepo').UsersRepo;
const Users = new UsersRepo(dbUserAccess);

/** Controllers **/
const UserController = require('./controller/UserController').UserController;
const userControl = new UserController(Users);

const ProjectController = require('./controller/ProjectController').ProjectController;
const projectControl = new ProjectController(Projects);

const SystemViewController = require('./controller/SystemViewController').SystemViewController;
const sysView = new SystemViewController();

const File_System = require('./controller/File_System').File_System;
const sysStorage = new File_System();
sysStorage.subscribe(sysView);

const System_Mailer = require('./controller/System_Mailer').System_Mailer;
const sysEmails = require('./model/System_Emails');
const sysMailer = new System_Mailer(sysEmails);
sysMailer.subscribe(sysView);

const SystemActionController = require('./controller/SystemActionController').SystemActionController;
const sysAct = new SystemActionController(userControl,projectControl);
sysAct.subscribe(sysMailer);
sysAct.subscribe(sysStorage);
sysAct.subscribe(userControl);

const SystemAuthController = require('./controller/SystemAuthController').SystemAuthController;
const sysAuth = new SystemAuthController(userControl,projectControl);
sysAuth.subscribe(sysView);
sysAuth.subscribe(sysAct);


/** Standard Routes **/

app.get('/',(req,res)=>{
    res.redirect('/login');
});
app.get('/login',(req,res)=>{
    sysAuth.displayLogin(req,res);
});
app.post('/login',(req,res)=> {
   sysAuth.authorizeLogin(req,res).catch((err=>{throw err}));
});
app.get('/logout',(req,res)=>{
    sysAuth.logout(req,res);
});
app.get('/unauthorized',(req,res)=>{
    sysAuth.displayUnauthorized(req,res);
});
app.get('/dashboard',(req,res)=>{
    sysAuth.authorizeSession(req,res).catch((err)=>{throw err});
});
app.get('/projects/project/:id',(req,res)=>{
    sysAuth.authorizeProjectView(req,res).catch(err=>{throw err});
});
app.get('/projects/project/:id/folders/folder/:folderid',(req,res)=>{
    sysAuth.authorizeFolderView(req,res).catch(err=>{throw err});
});
app.post('/projects/folders/upload',(req,res)=>{
    sysAuth.authorizeUpload(req,res).catch((err)=>{throw err});
});
app.get('/projects/project/:id/folders/folder/:folderid/file/:filename',(req,res)=>{
    sysAuth.authorizeFileView(req,res).catch((err)=>{throw err});
});
app.get('/projects/project/:id/folders/folder/:folderid/file/:filename/attachment',(req,res)=>{
    sysAuth.authorizeFileDownload(req,res).catch((err)=>{throw err});
});

/** AJAX end points **/
app.get('/users/project',(req,res)=>{
    sysAuth.authorizeAJAX(req,res).catch((err)=>{throw err});
});
app.get('/users',(req,res)=>{
    sysAuth.authorizeAJAX(req,res).catch((err)=>{throw err});
});
app.get('/users/user',(req,res)=>{
    sysAuth.authorizeAJAX(req,res).catch((err)=>{throw err});
});
app.get('/users/folders',(req,res)=>{
    sysAuth.authorizeAJAX(req,res).catch((err)=>{throw err});
});
app.get('/users/:email/exists',(req,res)=>{
    sysAuth.authorizeAJAX(req,res).catch((err)=>{throw err});
});
app.get('/projects/project/:id/folders/folder/:folderid/file/:filename/exists',(req,res)=>{
    sysAuth.authorizeAJAX(req,res).catch((err)=>{throw err});
});

/** New User Authorization **/
app.get('/users/authenticate',(req,res)=>{
    sysAuth.authorizeNewUser(req,res).catch((err)=>{throw err});
});
app.post('/users/authenticate',(req,res)=>{
    sysAuth.authorizeNewUser(req,res).catch((err)=>{throw err});
});

/** Administrator Authorization Required Actions **/
app.get('/users/:id/profile',(req,res)=>{
    sysAuth.authorizeProfileView(req,res).catch(err=>{throw err});
});
app.post('/users/:id/delete',(req,res)=>{
    sysAuth.authorizeDeleteAccount(req,res).catch((err)=>{throw err});
});
app.post('/users/project/permissions/remove',(req,res)=>{
    sysAuth.authorizeAdmin(req,res).catch(err=>{throw err});
});
app.post('/users/project/permissions/add',(req,res)=>{
    sysAuth.authorizeAdmin(req,res).catch(err=>{throw err});
});
app.post('/users/folders/permissions/add',(req,res)=>{
    sysAuth.authorizeAdmin(req,res).catch(err=>{throw err});
});
app.post('/users/folders/permissions/remove',(req,res)=>{
    sysAuth.authorizeAdmin(req,res).catch(err=>{throw err});
});
app.get('/users/invite',(req,res)=>{
    sysAuth.authorizeAdmin(req,res).catch(err=>{throw err});
});
app.post('/users/invite',(req,res)=>{
    sysAuth.authorizeAdmin(req,res).catch(err=>{throw err});
});
app.post('/projects/project/:id/rename',(req,res)=>{
    sysAuth.authorizeAdmin(req,res).catch(err=>{throw err});
});
app.post('/projects/project/:id/folders/folder/:folderid/file/:filename/delete',(req,res)=>{
    sysAuth.authorizeAdmin(req,res).catch(err=>{throw err});
});
app.post('/projects/project/:id/folders/folder/:folderid/delete',(req,res)=>{
    sysAuth.authorizeAdmin(req,res).catch(err=>{throw err});
});
app.post('/projects/project/:id/delete',(req,res)=>{
    sysAuth.authorizeAdmin(req,res).catch(err=>{throw err});
});
app.post('/projects/create',(req,res)=>{
    sysAuth.authorizeAdmin(req,res).catch(err=>{throw err});
});