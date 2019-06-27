/** Dependencies **/
const User = require('./models/User').User;

/** App Framework **/
const express = require('express');
const session = require('express-session');

/** App Components **/
const bodyParser = require('body-parser');
const cors  = require('cors');

/** ID and Password Tools **/
const uuid = require('uuid');

/** Database **/
const url = 'mongodb://localhost:27017';
const dbName = 'novvdr';
const Database = require('./util/Database').Database;
const db = new Database(url,dbName);

const Users_Repository = require('./observables/Users_Repository').Users_Repository;
let userRepo;
const Users_DB = require('./observers/Users_DB').Users_DB;
let userDB;


db.connect().then((res)=>{

    userRepo = new Users_Repository();
    userDB = new Users_DB(db);
    userRepo.subscribe(userDB);
    userDB.getAllUsers().then((res)=>{
        for(let i = 0; i < res.length; i++){
            userRepo.users[i] = new User(
                res[i].id,
                res[i].admin,
                res[i].firstname,
                res[i].lastname,
                res[i].email,
                res[i].password,
                res[i].folder
            );
        }
    }).catch((err)=>{throw err});

}).catch((err)=>{
    throw err
});



/** Initialize App **/
const app = express();
const port = 3000;
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true,limit: '50mb'}));
app.use(bodyParser.json());
app.use(cors());
app.listen(port, () => console.log(`listening on port 3000!`));


/** User Sessions **/
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

    res.render('login');

});

app.post('/login',(req,res)=> {

   const email =  req.body.email;
   const password = req.body.password;

   if(userRepo.getUserByEmail(email)){

       const user = userRepo.getUserByEmail(email);

       if(userRepo.authenticate(password,user.password)){

           req.session.user = user;

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

app.get('/dashboard',(req,res)=>{

    if(req.session && req.session.user) {

        res.send(req.session.user);

    }else{

        req.session.origin = '/dashboard';
        res.redirect('/login');

    }

});
