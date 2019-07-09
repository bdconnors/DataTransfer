/** App Framework **/
const express = require('express');
const session = require('express-session');

/** App Components **/
const bodyParser = require('body-parser');
const cors  = require('cors');
const path = require('path');

/** UniqueID Generator**/
const uuid = require('uuid');

/** File System **/
const fs = require('fs');

/** User Authentication **/
const Authentication = require('./util/Authentication').Authentication;
const auth = new Authentication();

/** Database **/
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'novvdr';

    /** Database CRUD Functions**/
    const Database = require('./util/Database').Database;
    const db = new Database(url,dbName);


/** Internal Data Structures **/

    /** Factories **/
    const File_Permission_Factory = require('./model/user/files/File_Permission_Factory').File_Permission_Factory;
    const fileFactory = new File_Permission_Factory();

    const Folder_Permission_Factory = require('./model/user/folders/Folder_Permission_Factory').Folder_Permission_Factory;
    const folderFactory = new Folder_Permission_Factory(fileFactory);

    const User_Factory = require('./model/user/User_Factory').User_Factory;
    const userFactory = new User_Factory(folderFactory);

    /** Local Storage Access **/
    const File_System = require('./File_System').File_System;
    const storage = new File_System();

    /** System Mailer **/
    const System_Mailer = require('./util/System_Mailer').System_Mailer;
    const systemMailer = new System_Mailer('gmail','system.novitious@gmail.com','Rubix123');

    /** User Action Center **/
    let User_Action = require('./controller/User_Action').User_Action;
    let userAction;

    /** User Repository **/
    const Users_Repo = require('./model/user/Users_Repo').Users_Repo;
    let userRepo;

/** App Start Up **/

    /** Connect to Database and load Internal Data Structures **/
    db.connect().then((res)=>{

        userRepo = new Users_Repo(userFactory,folderFactory,storage,systemMailer);
        userAction  = new User_Action(userRepo,auth);
        userRepo.subscribe(db);

        db.retrieveDocuments('users',{}).then((res)=>{

            userRepo.load(res);

        }).catch((err)=>{
            throw err
        });

    }).catch((err)=>{
        throw err
    });



    /** Initialize App and App Components **/

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
                return uuid()
            },
            secret: 'ProjectSapphire',
            resave: true,
            saveUninitialized: true,
            name: 'session',
            secure: false,
            rolling: true,
            cookie: { maxAge: 3600000 }
        }));

app.get('/',(req,res)=>{

    if(auth.checkSession(req)) {

        if (userAction.verifyUser(req.session.user)) {

            if (req.session.origin) {

                res.redirect(req.session.origin)
            }

            res.redirect('/dashboard')
        }
    }

    res.render('./login/login');


});

app.post('/',(req,res)=> {

   const email =  req.body.email;
   const password = req.body.password;
   if(userAction.signIn(email,password)){

       req.session.user = userAction.user;

       res.redirect('/dashboard');
   }else{
       res.send('Bad Password or User Not Found');
   }


});

app.get('/logout',(req,res)=>{

    if(auth.checkSession(req)){

        req.session.destroy();
        res.redirect('/');

    }else{

        res.redirect('/');

    }
});

app.get('/dashboard',(req,res)=>{

    if(auth.checkSession(req)) {

        if(userAction.verifyUser(req.session.user)) {

            res.render('./dashboard/dashboard', {user: userAction});

        }else{
            res.redirect('/logout');
        }

    }else{
        req.session.origin = '/dashboard';
        res.redirect('/');
    }

});

app.get('/add/user',(req,res)=>{

   if(auth.checkSession(req)){

        if(auth.checkAdmin(req.session.user)){

            res.render('./invite_user/invite_user',{user:userAction});

          }else{

            res.send('User Unauthorized');

        }

    }else{
        req.session.origin = '/add/user';
        res.redirect('/');
    }

});
app.post('/add/user',(req,res)=>{

    if(auth.checkSession(req)){

        if(auth.checkAdmin(req.session.user)) {

            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const fullname = firstname +' '+lastname;
            const email = req.body.email;
            const account = req.body.account;
            const permissions = auth.accountType(account);

            if(userAction.inviteUser(firstname,lastname,email,permissions)) {

                res.render('./invite_user/invite_user_success', {
                    user:userAction,
                    name: fullname,
                    email: email,
                    account: account
                });

            }else{

                res.send("error");

            }

        }else{
            res.send('Un-Authorized User');
        }

    }else{
        req.session.origin = '/add/user';
        res.redirect('/');
    }

});


app.get('/newuser',(req,res)=>{


        let authcode = req.query.authcode;

        if(!auth.checkSession(req)) {

            if (userRepo.retrieveBy('authCode', authcode)) {
                let user = userRepo.retrieveBy('authCode', authcode);
                res.render('./create_user/create_user', {firstname: user.firstname});
            } else {
                res.send('Link Expired or Account Already Created');
            }
        }else{
            res.redirect('/logout');
        }


});

app.post('/newuser',(req,res)=>{

    const user = userRepo.retrieveBy('authCode',req.query.authcode);

    const password = req.body.password;
    user['password'] = auth.createHashPassword(password);
    user['authCode'] = '';

    if(userRepo.updateMultipleFields(user.email,user)){
        res.redirect('/newuser/success?name='+user.firstname+' '+user.lastname+'&email='+user.email);
    }else{
        res.send('Fail');
    }


});

app.get('/newuser/success',(req,res)=>{

    if(req.query.name && req.query.email) {
        res.render('./create_user/create_user_success', {
            name: req.query.name,
            email: req.query.email
        });
    }else{
        res.send('Something Went Wrong Contact System Administator');
    }

});
app.get('/add/folder',(req,res)=>{

    if(auth.checkSession(req)){
        if(auth.checkWritePriv(req.session.user)||auth.checkAdmin(req.session.user)){
            res.render('./add_folder/add_folder',{user:userAction});
       }
    }else{
        req.session.origin = '/add/folder';
        res.redirect('/');
    }
});
app.post('/add/folder',(req,res)=>{

    const name = req.body.name;
    let users = [];

    if(req.body.users){

        if(typeof req.body.users === 'object'){

            for(let i = 0; i < req.body.users.length; i++){
                users.push({id:req.body.users[i],permission:req.body[req.body.users[i]]});
            }

        }else{
            users.push({id:req.body.users,permission:req.body[req.body.users]});
            console.log(users);
        }
    }
    res.send(userAction.createFolder(req.session.user,name,users));



});


app.get('/folder/:folder',(req,res)=>{

    /**const folderReq = req.params.folder;
    if(auth.checkSession(req)) {

        if(userAction.getFolder('name',folderReq)) {

            const folder = userAction.getFolder('name',folderReq);
            res.render('./folder/folder', {
                folder: folder,
                users: userRepo.users,
                folders: userAction.userFolders,
                user: req.session.user
            });
        }else{
            res.send("You're either an Un-Authorized user or the requested folder no longer exits");
        }


    }else{
        req.session.origin = '/folder/'+folderReq;
        res.redirect('/');
    }**/

});


app.get('/folder/:folder/:file',(req,res)=>{

    /**if(folderRepo.getFolder('name',req.params.folder)){

        let folder = folderRepo.getFolder('name', req.params.folder);

        if (folderRepo.getFile(folder.id,'name', req.params.file)) {

            let file = folderRepo.getFile(folder.id,'name', req.params.file);

            if (auth.checkFilePermission(folder,file, req.session.user)) {

                res.setHeader('Content-Type',file.mime);
                res.setHeader('Content-Disposition', 'inline; filename=' + file.name);
                let stream = fs.createReadStream('./storage/' + req.params.folder + '/' + req.params.file);
                stream.pipe(res);
            } else {
                res.send('Unauthorized');
            }

        } else {
            res.send('file not found');
        }
    }else{
        res.send('folder not found');
    }**/


});
app.get('/folder/:folder/upload/file',(req,res)=>{
	
	/**const user = req.session.user;
	const folder = folderRepo.getFolder('name',req.params.folder);
    console.log(folder);


	if(auth.checkSession(req)){
		if(auth.checkFolderPermission(folder,user)){

			res.render('./upload_file/upload_file.ejs',{user:user,folder:folder,users:userRepo.users,folders:folderRepo.folders})

		}else{
			res.send('unauthorized user');
		}
	}else{
	    req.session.origin = '/folder/'+req.params.folder+'/upload/file';
		res.redirect('/')
	}**/
	
});
app.post('/folder/:folder/upload/file',(req,res)=>{

    /**const folder = req.params.folder;
    const fileName = req.body.input;
    const data = req.body.data;
    let users;

    if(req.body.users) {
        if (req.body.users === []) {
            users = req.body.users;
        } else {
            users = [];
            users[0] = req.body.users;
        }

    }else {
        users = [];
    }
    res.send(userAction.addFile(folder,fileName,data,users));**/


});

app.post('/folder/:folder/delete/file/:file',(req,res)=>{

    /**const folder = req.params.folder;
    const file = req.params.file;
    userAction.deleteFile(folder,file).then((result)=>{
        res.send(result);
    }).catch((err)=>{
        res.send(err);
    });**/


});
app.post('/delete/folder/:folder',(req,res)=>{

    /**const folder = req.params.folder;
    userAction.deleteFolder('name',folder).then((result)=>{
        res.send(result);
    }).catch((err)=>{
        res.send(err);
    });**/


});
