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

    async sendEmail(authResponse){

        let email = this.getEmail(authResponse.variables.email,authResponse.variables.email.action);
        await this.transporter.sendMail(email).then(()=>{
            if(authResponse.variables.email.action === 'INVITED'||authResponse.variables.email.action ==='PROJECT ADD'){
                authResponse.response.send(authResponse.variables.email.user);
            }else if(authResponse.variables.email.action === 'AUTHENTICATED'){
                authResponse.display = '/users/authSuccess';
                authResponse.command = 'DISPLAY';
                authResponse.variables.user = authResponse.variables.email.user;
                this.notifyAll(authResponse)
            }
        }).catch(err=>{
            console.log(err)
        });
    }

    getEmail(variables,action){

        let to = variables.user.email;
        let url;
        let subject;
        let body;

        if(action === 'INVITED'){
            url = this.sysEmails.inviteURL(variables.user.authCode);
            subject = this.sysEmails.inviteSubject(this.company);
            body = this.sysEmails.inviteBody(variables.user,this.company,url);
        }else if(action === 'AUTHENTICATED'){
            url = this.sysEmails.authUrl();
            subject =this.sysEmails.authSubject(this.company);
            body = this.sysEmails.authBody(variables.user,this.company,url);
        }else if(action === 'PROJECT ADD'){
            subject = this.sysEmails.projectAddSubject(variables.permission);
            body = this.sysEmails.projectAddBody(variables.user,variables.permission,this.company);
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
