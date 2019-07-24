const mailer = require('nodemailer');
const Email = require('../model/Email').Email;

class System_Mailer{

    constructor(sysEmails){

        this.sysEmails = sysEmails;

        this.service = process.env.SYSTEM_EMAIL_SERVICE;
        this.email = process.env.SYSTEM_EMAIL;
        this.password = process.env.SYSTEM_EMAIL_PASSWORD;
        this.company = process.env.SYSTEM_EMAIL_COMPANY;
        this.url = process.env.SYSTEM_HOST_URL;

        this.observers = [];

        this.transporter = mailer.createTransport({
            service: this.service,
            auth: {
                user: this.email,
                pass: this.password
            }
        });
    }

    invite(authResponse){

        let user = authResponse.variables.email.user;
        console.log(user);
        let to = user.email;
        console.log(to);
        let from = this.sysEmails.from(this.company,this.email);
        let subject = this.sysEmails.inviteSubject(this.company);
        let body = this.sysEmails.inviteBody(user,this.company,this.url);
        let email = this.make(to,from,subject,subject,body);
        console.log('before email');
        this.transporter.sendMail(email).then(()=>{
            console.log(authResponse.command);
            authResponse.command = 'DISPLAY';
            console.log(authResponse.command);
            authResponse.display = '/users/inviteSuccess';
            this.notifyAll(authResponse);
        }).catch(err=>{throw err});


    }

    make(from,to,subject,text,html){
        return new Email(from,to,subject,text,html);
    }

    notify(authResponse){
        if(authResponse.variables.email){
            if(authResponse.variables.email.action === 'INVITE USER') {
                this.invite(authResponse);
            }
        }
    }

    subscribe(obs){
        this.observers.push(obs);
    }

    notifyAll(authResponse){

        this.observers.map(observer => observer.notify(authResponse));

    }
}
module.exports = {System_Mailer:System_Mailer};
