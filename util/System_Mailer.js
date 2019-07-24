const mailer = require('nodemailer');
const Email = require('../model/Email').Email;

class System_Mailer{

    constructor(sysEmails) {

        this.sysEmails = sysEmails;

        this.service = process.env.SYSTEM_EMAIL_SERVICE;
        this.email = process.env.SYSTEM_EMAIL;
        this.password = process.env.SYSTEM_EMAIL_PASSWORD;
        this.company = process.env.SYSTEM_EMAIL_COMPANY;

        this.observers = [];

        this.transporter = mailer.createTransport({
            service: this.service,
            auth: {
                user: this.email,
                pass: this.password
            }
        });
    }

    sendEmail(authResponse){

        let user = authResponse.variables.email.user;
        let action = authResponse.variables.email.action;
        let email = this.getEmail(user,action);

        this.transporter.sendMail(email).then(()=>{
            authResponse.command = 'DISPLAY';
            this.notifyAll(authResponse);
        }).catch(err=>{
            throw err
        });
    }

    getEmail(user,action){

        let to = user.email;
        let url;
        let subject;
        let body;

        if(action === 'INVITED'){
            url = this.sysEmails.inviteURL(user.authCode);
            subject = this.sysEmails.inviteSubject(this.company);
            body = this.sysEmails.inviteBody(user,this.company,url);
        }else if(action === 'AUTHENTICATED'){
            url = this.sysEmails.authUrl();
            subject =this.sysEmails.authSubject(this.company);
            body = this.sysEmails.authBody(user,this.company,url);
        }

        return this.make(to,subject,body);
    }

    make(to,subject,body){
        let from = this.sysEmails.from(this.company,this.email);
        return new Email(to,from,subject,subject,body);
    }

    notify(authResponse){
        if(authResponse.variables.email){
            this.sendEmail(authResponse);
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
