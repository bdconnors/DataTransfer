exports.verifyEmail = function(email,code){
    return{
        from: '"Novitious" <teh133753k5@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Novitious Account Information', // Subject line
        text: 'Account Name: '+email +' Verification Link: http://localhost:3000/verify/'+code, // plain text body
        html: `<b>Noivitious Account Information</b>
                <br>
                <p>Account Name: ${email}</p>
                <p >Verification Link: <a href="http:/localhost:3000/verify/${code}">http:/localhost:3000/verify/${code}</a></p>` // html body
    };
};