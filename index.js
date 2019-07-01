/** App Framework **/
const express = require('express');
const session = require('express-session');

/** App Components **/
const bodyParser = require('body-parser');
const cors  = require('cors');
const path = require('path');

/** UniqueID Generator**/
const uuid = require('uuid');


/** User Authentication **/
const Authentication = require('./util/Authentication').Authentication;
const auth = new Authentication();

/** Database **/
const url = 'mongodb://localhost:27017';
const dbName = 'novvdr';

    /** Database CRUD Functions**/
    const Database = require('./util/Database').Database;
    const db = new Database(url,dbName);


/** Internal Data Structures **/

    /** User Action Center **/
    let User_Action = require('./User_Action').User_Action;
    let userAction;

    /** User Repository **/
    const Users_Repo = require('./Users_Repo').Users_Repo;
    let userRepo;

    /** Folder Repository **/
    const Folders_Repo = require('./Folders_Repo').Folders_Repo;
    let folderRepo;


/** App Start Up **/

    /** Connect to Database and load Internal Data Structures **/
    db.connect().then((res)=>{

        userRepo = new Users_Repo();
        userRepo.subscribe(db);

        folderRepo = new Folders_Repo();
        folderRepo.subscribe(db);

        db.retrieveDocuments('users',{}).then((res)=>{

            userRepo.users = res;
            console.log(userRepo.users);

            db.retrieveDocuments('folders', {}).then((res) => {

                folderRepo.folders=res;
                console.log(folderRepo.folders);


            }).catch((err) => {
                throw err;
            });


        }).catch((err)=>{
            throw err
        });

    }).catch((err)=>{
        throw err
    });



    /** Initialize App and App Components **/

        /** Use Express for App Engine and listen on port 3000 **/
        const app = express();
        app.listen(3000, () => console.log(`listening on port 3000!`));

        /** Use ejs for View Engine **/
        app.set('view engine','ejs');
        app.use( express.static( "public" ));
        app.set("views", "public");

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

   res.redirect('/login');

});

app.get('/login',(req,res)=>{

    res.render('./login/login');

});

app.post('/login',(req,res)=> {

   const email =  req.body.email;
   const password = req.body.password;

   if(userRepo.getUser('email',email)){

       const user = userRepo.getUser('email',email);

       if(auth.checkPassword(password,user.password)){

           req.session.user = user;
           userAction = new User_Action(user,folderRepo);

           if(req.session.origin) {

               res.redirect(req.session.origin);

           }else{

               res.redirect('/dashboard');
           }

       }else{

           res.send('Bad Password');
       }

   }else{

       res.send('User Not Found');

   }

});

app.get('/logout',(req,res)=>{

    if(req.session && req.user){
        req.session.destroy();
        res.redirect('/login');
    }else{
        res.redirect('/login');
    }
});

app.get('/dashboard',(req,res)=>{

    if(req.session && req.session.user) {
        let user = req.session.user;
        res.render('./dashboard/dashboard',{user:user,folders:folderRepo.folders,users:userRepo.users})

    }else{

        req.session.origin = '/dashboard';
        res.redirect('/login');

    }

});


app.post('/add/user',(req,res)=>{

    if(auth.checkSession(req)){

        if(auth.checkAdmin(req.session.user)){

            let firstname = req.body.firstname;
            let lastname = req.body.lastname;
            let email = req.body.email;

            userRepo.createUser(false,firstname,lastname,email).then((result)=>{
                res.send(result);
            }).catch((err)=>{

                res.send('Server Error');
            });

        }else{
            res.send('User Unauthorized');
        }

    }else{
        req.session.origin = '/add/user';
        res.redirect('/login');
    }

});

app.get('/newuser',(req,res)=>{

    if(auth.checkSession(req)) {
        let authcode = req.query.authcode;

        if (userRepo.getUser('authCode', authcode)) {
            let user = userRepo.getUser('authCode', authcode);
            res.render('createUser', {firstname: user.firstname});
        }
    }else{
        res.send('Please Log Out First');
    }

});

app.post('/newuser',(req,res)=>{

    const user = userRepo.getUser('authCode',req.query.authcode);

    const password = req.body.password;
    const hashPassword = auth.createHashPassword(password);

    if(userRepo.updateUser({id:user.id,admin:user.admin,firstname:user.firstname,lastname:user.lastname,email:user.email,password:hashPassword,authCode:''})){
        res.redirect('/newuser/success?name='+user.firstname+' '+user.lastname+'&email='+user.email);
    }else{
        res.send('Fail');
    }


});

app.get('/newuser/success',(req,res)=>{

    if(req.query.name && req.query.email) {
        res.render('userAddSuccess', {
            name: req.query.name,
            email: req.query.email
        });
    }

});

app.post('/add/folder',(req,res)=>{

    const folderName = req.body.name;
    let users;

    if(req.body.users) {
        if (req.body.users === []) {
            users = userRepo.getManyUsers(req.body.users);
        } else {
            users = [userRepo.getUser(req.body.users)];
        }

    }else {
        users = [];
    }

    if(userAction.addFolder(folderName,req.session.user,users)){
        res.send('Success')
    }else{
        res.send('fail');
    }

});


app.get('/folder/:folder',(req,res)=>{

    const folderReq = req.params.folder;
    if(auth.checkSession(req)) {

        if(userAction.getFolder('name',folderReq)) {

            const folder = userAction.getFolder('name',folderReq);

            res.render('./folder/folder', {
                folder: folder,
                users: userRepo.users,
                folders: folderRepo.folders,
                user: req.session.user
            });
        }else{
            res.send("You're either an Un-Authorized user or the requested folder no longer exits");
        }


    }else{
        req.session.origin = '/folder/'+folderReq;
        res.redirect('/login');
    }

});

app.post('/file/upload',(req,res)=>{


    res.send(req.body);

});