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


/** Routes **/

app.get('/',(req,res)=>{
  Projects.createProject('New Project').then((result)=>{res.send(result)}).catch((err)=>{res.send(err)});
});

/**app.get('/login',(req,res)=>{

    user.requestLogin(req,res);

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

    user.requestDashboard(req,res);

});

app.get('/users/invite',(req,res)=>{
    console.log(req);
    user.requestInviteForm(req,res);

});

app.post('/users/invite',(req,res)=>{

    user.inviteUser(req,res);

});

app.get('/users/authenticate',(req,res)=>{

    user.requestNewUserAuth(req,res);
});

app.post('/users/authenticate',(req,res)=>{

    user.submitNewAccount(req,res);

});

app.get('/users/user/:id',(req,res)=>{

    user.requestUserProfile(req,res);

});

app.get('/users/delete',(req,res)=>{

    res.send('delete user');

});

app.get('/projects/project/:id',(req,res)=>{

    user.requestProject(req,res);

});

app.get('/projects/newproject',(req,res)=>{

    user.requestCreateProjectForm(req,res);

});

app.post('/projects/newproject',(req,res)=>{

    user.createProject(req,res);
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

app.get('/projects/project/:id/folders/folder/:folderid/permissionSchemas',(req,res)=>{

    user.folderpermissionSchemasForm(req,res);

});
app.post('/projects/project/:id/folders/folder/:folderid/permissionSchemas',(req,res)=>{

    res.send(req.body);

});**/


