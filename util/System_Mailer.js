const mailer = require('nodemailer');

class System_Mailer{

    constructor(service,email,pass){

        this.service = service;
        this.email = email;
        this.pass = pass;
        this.from = '"Novitious" <'+this.email+'>';

        this.transporter = mailer.createTransport({
            service: this.service,
            auth: {
                user: this.email,
                pass: this.pass
            }
        });
    }

    invite(firstname,email,authcode){

        let success = true;

        const mailOptions = {
            from: this.from,
            to: email,
            subject: 'Novitious Account Creation',
            text: 'Novitious Account Creation',
            html: `<p>Dear ${firstname},</p>
                   <p><b>Please Follow The Link Below To Create Your Novitious Account:</b></p>
                   <p>Account Creation Link: <a href='http://localhost/newuser?authcode=${authcode}'>http://localhost/newuser?authcode=${authcode}</a></p>
                   <p>Thanks, </p>
                   <p>Novitious Team</p>
                   <br>
                   <p>** This E-mail was Automatically Generated by the Novitious System **</p>
                   <p>** An Administrator requested ${email} to create an account with Novitious**</p>
                   <p>** If you believe this E-mail is a mistake please ignore it **</p>`

        };

        this.transporter.sendMail(mailOptions,(info,err)=>{
            if(err){success = false}
            success = true;
        });
        return success;


}



}
module.exports = {System_Mailer:System_Mailer};
