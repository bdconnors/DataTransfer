/**
 * @fileoverview Entry point and routing index for Virtual Data Room requests.
 * @author bdc5435@rit.edu (Brandon Connors)
 */


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


/** Home Page Routes **/


app.get('/',(req,res)=>{
    res.render('index')
});
app.get('/about',(req,res)=>{
    res.render('about')
});
app.get('/services',(req,res)=>{
    res.render('services');
});
app.get('/compensation',(req,res)=>{
    res.render('compensation');
});
app.get('/team',(req,res)=>{
    res.render('team');
});
app.get('/contact',(req,res)=>{
    res.render('contact');
});
app.get('/team/:name',(req,res)=>{
    let name = req.params.name;
    res.render(name);
});


/** Application Routes **/

/**
 *
 * Handles login Page requests
 *
 * @param {req} req
 * @param {res} res
 *     req: express http request object
 *     res: express http response object
 */
app.get('/login',(req,res)=>{
    sysAuth.displayLogin(req,res);
});
/**
 *
 * Handles user login requests.
 *
 * if login credentials are verified, redirects to dashboard page.
 *
 * if user email is not found or password is incorrect, serves login fail page.
 *
 * @param {req} req
 * @param {res} res
 *     req: express http request object
 *     res: express http response object
 */
app.post('/login',(req,res)=> {
   sysAuth.authorizeLogin(req,res).catch((err=>{console.log(err)}));
});
/**
 *
 * Logs user out, destroying request session.
 *
 * @param {req} req
 * @param {res} res
 *     req: express http request object
 *     res: express http response object
 */
app.get('/logout',(req,res)=>{
    sysAuth.logout(req,res);
});
/**
 *
 * Handles redirects for un-authorized user requests.
 *
 * serves unauthorized access page.
 *
 * @param {req} req
 * @param {res} res
 *     req: express http request object
 *     res: express http response object
 */
app.get('/unauthorized',(req,res)=>{
    sysAuth.displayUnauthorized(req,res);
});
/**
 *
 * Handles user dashboard page requests.
 * checks for a session obtained from logging in.
 *
 * if request has a session, serves user dashboard page.
 *
 * if request has no session, redirects to login page.
 *
 * @param {req} req
 * @param {res} res
 *     req: express http request object
 *     res: express http response object
 */
app.get('/dashboard',(req,res)=>{
    sysAuth.authorizeSession(req,res).catch((err)=>{console.log(err)});
});
/**
 *
 * Handles user project view request.
 *
 * if user has proper permission, serves the project page.
 *
 * if user does not have proper permission,redirects user
 * to unauthorized page.
 *
 * @param {req} req
 * @param {res} res
 *     req: express http request object
 *     res: express http response object
 */
app.get('/projects/project/:id',(req,res)=>{
    sysAuth.authorizeProjectView(req,res).catch(err=>{console.log(err)});
});
/**
 *
 * Handles user folder view requests.
 *
 * if a user has proper permission, serves the folder page.
 *
 * if a user does not have proper permission,redirects user
 * to unauthorized page.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 * @param {string} folderid
 *     req: express http request object
 *     res: express http response object
 *     id: Project ID
 *     folderid: Folder ID
 */
app.get('/projects/project/:id/folders/folder/:folderid',(req,res)=>{
    sysAuth.authorizeFolderView(req,res).catch(err=>{console.log(err)});
});
/**
 *
 * Handles user file upload requests.
 *
 * if a user has proper permission, writes request data to local storage,
 * creates a file database record and updates folder database record.
 *
 * if a user does not have proper permission,redirects user
 * to unauthorized page.
 *
 * @param {req} req
 * @param {res} res
 *     req: express http request object
 *     res: express http response object
 */
app.post('/projects/folders/upload',(req,res)=>{
    sysAuth.authorizeUpload(req,res).catch((err)=>{console.log(err)});
});
/**
 *
 * Handles user file view requests.
 *
 * if user has proper permission, streams file from local storage
 * to browser with inline content-disposition header.
 *
 * if user does not have proper permission,redirects user
 * to unauthorized page.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 * @param {string} folderid
 * @param {string} filename
 *     req: express http request object
 *     res: express http response object
 *     id: Project ID
 *     folderid: Folder ID
 *     filename: File Name
 */
app.get('/projects/project/:id/folders/folder/:folderid/file/:filename',(req,res)=>{
    sysAuth.authorizeFileView(req,res).catch((err)=>{console.log(err)});
});
/**
 *
 * Handles user file download requests.
 *
 * if user has proper permission, streams file from local storage
 * to browser with attachment content-disposition header.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 * @param {string} folderid
 * @param {string} filename
 *     req: express http request object
 *     res: express http response object
 *     id: Project ID
 *     folderid: Folder ID
 *     filename: File Name
 */
app.get('/projects/project/:id/folders/folder/:folderid/file/:filename/attachment',(req,res)=>{
    sysAuth.authorizeFileDownload(req,res).catch((err)=>{console.log(err)});
});
/**
 *
 * Handles client side AJAX requests to check if a file name already exists.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} name
 *     req: express http request object
 *     res: express http response object
 *     email: email, sent with request object and accessed by req.query.email
 *
 */
app.get('/projects/project/:id/folders/folder/:foldername/exists',(req,res)=>{
    console.log('inside app folder exists');
    sysAuth.authorizeAdminAJAX(req,res).catch((err)=>{console.log(err)});
});


app.get('/projects/project/:id/folders/folder/:folderid/file/:filename/exists',(req,res)=>{
    sysAuth.authorizeAJAX(req,res).catch((err)=>{console.log(err)});
});
/**
 *
 * Handles client side AJAX requests to check if an email is associated with ane existing user account.
 *
 * Email is sent as a request query parameter.
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} email
 *     req: express http request object
 *     res: express http response object
 *     email: email, sent with request object and accessed by req.query.email
 *
 */
app.get('/users/:email/exists',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch((err)=>{console.log(err)});
});
/**
 *
 * Handles client side AJAX requests to obtain database records of users
 * with permission to a project.
 *
 * Project is identified by project id number, which is sent as a request query parameter.
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 *     req: express http request object
 *     res: express http response object
 *     id: project id, sent with request object and accessed by req.query.id
 *
 */
app.get('/users/project',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch((err)=>{console.log(err)});
});
/**
 *
 * Handles client side AJAX requests to obtain database records of all users.
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 *     req: express http request object
 *     res: express http response object
 *
 */
app.get('/users',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch((err)=>{console.log(err)});
});
/**
 *
 * Handles client side AJAX requests to obtain database records of a user.
 *
 * User is identified by their user id number, which is sent as a request query parameter.
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 *     req: express http request object
 *     res: express http response object
 *     id: user id, sent with request object and accessed by req.query.id
 */
app.get('/users/user',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch((err)=>{console.log(err)});
});
/**
 *
 * Handles client side AJAX requests to obtain database records of users, who have permission to access a folder.
 *
 * Project and folder are identified by their respective id numbers, which are sent as request query parameters.
 *
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} projectid
 * @param {string} folderid
 *     req: express http request object
 *     res: express http response object
 *     projectid: project id, sent with request object and accessed by req.query.projectid
 *     folderid: folder id, sent with request object and accessed by req.query.folderid
 */
app.get('/users/folders',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch((err)=>{console.log(err)});
});


/**
 *
 * Handles account verification requests from email.
 *
 * The account is retrieved by authorization code sent as request query parameter.
 *
 *
 * @param {req} req
 * @param {res} res
 * @param {string} authCode
 *     req: express http request object
 *     res: express http response object
 *     authCode: authorization code, sent with request object and accessed by req.query.authCode
 */
app.get('/users/authenticate',(req,res)=>{
    sysAuth.authorizeNewUser(req,res).catch((err)=>{console.log(err)});
});
/**
 *
 * Handles account verification submissions.
 *
 * The account is retrieved by authorization code sent as request query parameter.
 *
 * User password and phone number submissions are sent in request body.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} authCode
 * @param {string} password
 * @param {string} phone
 *     req: express http request object
 *     res: express http response object
 *     authCode: authorization code, sent with request object and accessed by req.query.authCode
 *     password: user submitted password for account
 *     phone: user submitted phone number for account
 */
app.post('/users/authenticate',(req,res)=>{
    sysAuth.authorizeNewUser(req,res).catch((err)=>{console.log(err)});
});

/** Authorization for Administrative Actions **/

/**
 *
 * Handles requests for a user profile page.
 *
 * Profile page shows contact information and file activity.
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 *     id: User ID
 */
app.get('/users/:id/profile',(req,res)=>{
    sysAuth.authorizeProfileView(req,res).catch(err=>{console.log(err)});
});
/**
 *
 * Handles requests for deleting a user account.
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 *     req: express http request object
 *     res: express http response object
 *     id: user's id number
 */
app.post('/users/:id/delete',(req,res)=>{
    sysAuth.authorizeDeleteAccount(req,res).catch((err)=>{console.log(err)});
});
/**
 * Handles requests for revoking a user's project permission.
 *
 * User and project are identified by their respective id numbers, which are sent as request query parameters.
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 * @param {string} projectId
 *     req: express http request object
 *     res: express http response object
 *     id: user's id number
 *     projectId: project's id number
 */
app.post('/users/project/permissions/remove',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});
/**
 * Handles requests for granting a user permission to a project.
 *
 * User and project are identified by their respective id numbers, which are sent as request query parameters.
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 * @param {string} projectId
 *     req: express http request object
 *     res: express http response object
 *     id: user's id number
 *     projectId: project's id number
 */
app.post('/users/project/permissions/add',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});
/**
 * Handles requests for granting project folder permission to a user.
 *
 * User and project are identified by their respective id numbers sent as request query parameters.
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 * @param {string} projectId
 *     req: express http request object
 *     res: express http response object
 *     id: user's id number
 *     projectId: project's id number
 */
app.post('/users/folders/permissions/add',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});
/**
 * Handles requests for revoking a user's project folder permission.
 *
 * User,project and folder are identified by their respective id numbers sent as request query parameters.
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 * @param {string} projectId
 *     req: express http request object
 *     res: express http response object
 *     id: user's id number
 *     projectId: project's id number
 */
app.post('/users/folders/permissions/remove',(req,res)=>{
    sysAuth.authorizeAdminAction(req,res).catch(err=>{console.log(err)});
});
/**
 * Handles requests for revoking a user's project folder permission.
 *
 * User,project and folder are identified by their respective id numbers sent as request query parameters.
 *
 * Checks for administrative session, all other requests will be denied.
 *
 * @param {req} req
 * @param {res} res
 * @param {string} id
 * @param {string} projectId
 *     req: express http request object
 *     res: express http response object
 *     id: user's id number
 *     projectId: project's id number
 */
app.get('/users/invite',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});
/**
 * @param {req} req
 * @param {res} res
 *     req: express http request object
 *     res: express http response object
 */
app.post('/users/invite',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});
app.post('/users/recovery',(req,res)=>{
    sysAuth.authorizeRecovery(req,res).catch(err=>{console.log(err)});
});
app.get('/users/recovery/:authCode',(req,res)=>{
    sysAuth.authorizePasswordReset(req,res).catch(err=>{console.log(err)});
});
app.post('/users/recovery/:authCode',(req,res)=>{
    console.log('inside app');
    sysAuth.authorizePasswordReset(req,res).catch(err=>{console.log(err)});
});
/**
 * @param {req} req
 * @param {res} res
 * @param {string} id
 *     req: express http request object
 *     res: express http response object
 *     id: Project ID
 */
app.post('/projects/project/:id/rename',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});
app.post('/projects/project/:id/folders/folder/:folderid/rename',(req,res)=>{
    console.log('inside folder rename app');
    sysAuth.authorizeAdminAction(req,res).catch(err=>{console.log(err)});
});
/**
 * @param {req} req
 * @param {res} res
 *
 */
app.post('/projects/project/:id/folders/new',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});
/**
 * @param {req} req
 * @param {res} res
 *
 */
app.get('/users/folders',(req,res)=>{
    sysAuth.authorizeAdminAction(req,res).catch(err=>{console.log(err)});
});
/**
 * @param {req} req
 * @param {res} res
 *
 */
app.post('/users/folders/permissions/add',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});
/**
 * @param {req} req
 * @param {res} res
 * @param {string} id
 * @param {string} folderid
 * @param {string} filename
 *     req: express http request object
 *     res: express http response object
 *     id: Project ID
 *     folderid: Folder ID
 *     filename: File Name
 */
app.post('/projects/project/:id/folders/folder/:folderid/file/:filename/delete',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});
/**
 * @param {req} req
 * @param {res} res
 * @param {string} id
 * @param {string} folderid
 *     req: express http request object
 *     res: express http response object
 *     id: Project ID
 *     folderid: Folder ID
 */
app.post('/projects/project/:id/folders/folder/:folderid/delete',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});
/**
 * @param {req} req
 * @param {res} res
 * @param {string} id
 *     req: express http request object
 *     res: express http response object
 *     id: Project ID
 */
app.post('/projects/project/:id/delete',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});
/**
 * @param {req} req
 * @param {res} res
 */
app.post('/projects/create',(req,res)=>{
    sysAuth.authorizeAdminAJAX(req,res).catch(err=>{console.log(err)});
});