/** App Components **/
require('dotenv').config();
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


/** Routes **/

app.get('/',(req,res)=>{
    res.redirect('/login');
});

app.get('/login',(req,res)=>{

    sysAuth.getLogin(req,res);

});

app.post('/login',(req,res)=> {

   sysAuth.postLogin(req,res).catch((err=>{throw err}));

});

app.get('/dashboard',(req,res)=>{

    sysAuth.getDashboard(req,res).catch((err)=>{throw err});

});

app.get('/logout',(req,res)=>{

    sysAuth.getLogout(req,res);

});

app.get('/unauthorized',(req,res)=>{

    sysAuth.getUnauthorized(req,res);

});

app.get('/users',(req,res)=>{
    sysAuth.getAllUsers(req,res).catch((err)=>{throw err});

});
app.get('/users/user',(req,res)=>{

    sysAuth.getUser(req,res).catch(err=>{throw err});
});
app.get('/users/:id/profile',(req,res)=>{

    sysAuth.getUserProfile(req,res).catch(err=>{throw err});
});

app.get('/users/project',(req,res)=>{
    sysAuth.getProjectUsers(req,res).catch((err)=>{throw err});

});

app.post('/users/project/permissions/remove',(req,res)=>{
    sysAuth.postRemoveProjectPermission(req,res).catch(err=>{throw err});

});

app.post('/users/project/permissions/add',(req,res)=>{
    sysAuth.postAddProjectPermission(req,res).catch(err=>{throw err});

});

app.post('/users/folders/permissions/add',(req,res)=>{

    sysAuth.postAddFolderPermission(req,res).catch(err=>{throw err});

});
app.post('/users/folders/permissions/remove',(req,res)=>{

    sysAuth.postRemoveFolderPermission(req,res).catch(err=>{throw err});

});
app.get('/users/folders',(req,res)=>{
    sysAuth.getFolderUsers(req,res).catch(err=>{throw err});

});

app.get('/users/invite',(req,res)=>{
    sysAuth.getInvite(req,res).catch((err)=>{throw err});

});

app.post('/users/invite',(req,res)=>{

    sysAuth.postInvite(req,res).catch((err)=>{throw err});

});

app.get('/projects/project/:id',(req,res)=>{

    sysAuth.getProjectPage(req,res).catch(err=>{throw err});

});

app.post('/projects/project/:id/delete',(req,res)=>{

    sysAuth.postDeleteProject(req,res).catch(err=>{throw err});

});

app.get('/projects/project/:id/folders/folder/:folderid',(req,res)=>{
    sysAuth.getFolderPage(req,res).catch(err=>{throw err});

});

app.post('/projects/project/:id/rename',(req,res)=>{

    sysAuth.postRenameProject(req,res).catch(err=>{throw err});
});

app.get('/projects/project/:id/folders/folder/:folderid/file/:filename',(req,res)=>{

    sysAuth.getViewFile(req,res).catch((err)=>{throw err});

});


app.get('/projects/project/:id/folders/folder/:folderid/file/:filename/attachment',(req,res)=>{

    sysAuth.getDownloadFile(req,res).catch((err)=>{throw err});

});

app.post('/projects/project/:id/folders/folder/:folderid/file/:filename/delete',(req,res)=>{

    sysAuth.postDeleteFile(req,res).catch((err)=>{throw err});

});

app.post('/projects/project/:id/folders/folder/:folderid/delete',(req,res)=>{

    sysAuth.postDeleteFolder(req,res).catch((err)=>{throw err});

});


app.post('/projects/project/:id/folders/new',(req,res)=>{

    sysAuth.postNewFolder(req,res).catch((err)=>{throw err});

});

app.post('/projects/folders/upload',(req,res)=>{

    sysAuth.postUploadFile(req,res).catch((err)=>{throw err});

});
app.post('/projects/folders/download',(req,res)=>{

    res.send(req.body);

});

app.post('/projects/create',(req,res)=>{

    sysAuth.postCreateProject(req,res).catch((err)=>{res.send(err)});

});
app.get('/users/authenticate',(req,res)=>{

    sysAuth.getAuthForm(req,res).catch((err)=>{throw err});
});

app.post('/users/authenticate',(req,res)=>{

    sysAuth.postAuthForm(req,res).catch((err)=>{throw err});

});

/**app.get('/users/user/:id',(req,res)=>{

    user.requestUserProfile(req,res);

});

app.get('/users/delete',(req,res)=>{

    res.send('delete user');

});

app.get('/projects/project/:id',(req,res)=>{

    user.requestProject(req,res);

});

/**app.get('/projects/project/:id/upload',(req,res)=>{

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

app.get('/projects/project/:id/permissionSchemas',(req,res)=>{

    user.projectpermissionSchemasForm(req,res);

});

app.post('/projects/project/:id/permissionSchemas',(req,res)=>{

    user.updateProjectpermissionSchemas(req,res);

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
app.get('/projects/project/:id/files/:fileid/permissionSchemas',(req,res)=>{

    user.filepermissionSchemasForm(req,res);

});
app.get('/projects/project/:id/files/:fileid/permissionSchemas',(req,res)=>{

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

app.get('/projects/project/:id/folders/folders/:folderid/upload',(req,res)=>{

    user.folderUploadForm(req,res);

});
app.post('/projects/project/:id/folders/folders/:folderid/upload',(req,res)=>{

    user.uploadToFolder(req,res);

});
app.get('/projects/project/:id/folders/folders/:folderid/rename',(req,res)=>{

    user.folderRenameForm(req,res);

});
app.post('/projects/project/:id/folders/folders/:folderid/rename',(req,res)=>{

    user.renameFolder(req,res);

});

app.get('/projects/project/:id/folders/folders/:folderid/permissionSchemas',(req,res)=>{

    user.folderpermissionSchemasForm(req,res);

});
app.post('/projects/project/:id/folders/folders/:folderid/permissionSchemas',(req,res)=>{

    res.send(req.body);

});**/


