/** Dependencies **/
const User = require('./models/User').User;
/** App Framework **/
const express = require('express');
const session = require('express-session');

/** App Components **/
const bodyParser = require('body-parser');
const cors  = require('cors');

/** ID and Password Tools **/
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const uuid = require('uuid');

/** User Tools **/
const userAuth = require('./observables/Users_Repository');
const userMail = require('./util/User_Mail');

/** File Storage Access **/
const fs = require('fs');

/** System Email **/
const mailer = require('nodemailer');
const transporter = mailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'system.novitious@gmail.com',
        pass: 'Rubix123'
    }
});


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


/** Initialize App's User Sessions **/
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
    console.log(userRepo.users);
    res.send(userRepo.users);

});

/**app.get('/login',(req,res)=>{

    res.render('login');

});

app.post('/login',(req,res)=> {

    const email = req.body.email;
    const password = req.body.password;


    if (userAuth.getUserByEmail(users,email)) {

        const user = userAuth.getUserByEmail(users,email);
        const hashedPassword = user.password;
        const success = userAuth.checkPassword(password,hashedPassword);

        if(success){

            req.session.user = user;

            if(req.session.origin){
                res.redirect(req.session.origin);
            }else {
                res.redirect('/dashboard');
            }

        }else{
            res.send('Bad Password');
        }

    } else {
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
app.get('/create/user',(req,res)=>{

    if(req.session && req.session.user) {

        if(req.session.user.admin === true) {
            res.render('createUser');
        }else{
            res.send('Access Denied');
        }

    }else{
        req.session.origin = '/create/user';
        res.redirect('/login');
    }
});

app.post('/create/user',(req,res)=>{

    if(req.session && req.session.user && req.session.user.admin === true) {

        let admin;
        let firstname;
        let lastname;
        let email;
        let folder;

        if (req.body.admin) {
            admin = req.body.admin === 'true'
        }
        if (req.body.firstname) {
            firstname = req.body.firstname
        }
        if (req.body.lastname) {
            lastname = req.body.lastname
        }
        if (req.body.email) {
            email = req.body.email
        }
        if (req.body.folder) {
            folder = req.body.folder
        }

        const userID = uuid();
        const user = new User(userID, admin, firstname, lastname, email, '', folder);

        db_users.insertOne(user).then((result) => {

            const oneTimeCode = uuid();

            db_auth_codes.insertOne({userid:userID,code: oneTimeCode},(err,result)=> {

                if(err){throw err}

                transporter.sendMail(userMail.verifyEmail(email, oneTimeCode), (err, info) => {
                    if (err) {throw err}
                });

                res.render('success',{email:email});

            });

        }).catch((err) => {

            throw err;

        })
    }else{
        res.send('Access Denied');
    }



});

app.get('/verify/:uid',(req,res)=>{

    if(req.session && req.session.user){
        res.send('You Must Sign Out');
    }else {
        const code = req.params.uid;
        const codeInfo = userAuth.getAuthCode(authCodes, code);
        const userid = codeInfo.userid;
        const password = userAuth.generatePassword();
        const hashedPassword = userAuth.createHashPassword(password);


        db_users.updateOne({id: userid}, {$set: {password: hashedPassword}}, (err, result1) => {


            if (err) {
                throw err
            }


            db_auth_codes.deleteOne({userid: userid}, (err, result2) => {

                if (err) {
                    throw err
                }
                res.render('passwordGen', {password: password});


            });
        });
    }

});**/

