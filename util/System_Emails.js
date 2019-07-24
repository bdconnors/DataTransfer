module.exports.from = function(company,email){
  return `${company}<${email}>`;
};
module.exports.inviteURL= function(authCode){
    return process.env.SYSTEM_HOST_URL+'/users/authenticate?authCode='+authCode;
};
module.exports.inviteSubject = function(company){
    return `${company} Account Creation`;
};

module.exports.inviteBody = function(user,company,inviteUrl){
    return `<p>Dear ${user.firstname},</p>
    <p><b>Please Follow The Link Below To Create Your ${company} Account:</b></p>
    <p><pre>Account Creation Link: <a href='${inviteUrl}'>Create Account</a></pre></p>
    <p>Thanks, </p>
    <p>${company} Team</p>
    <br>
    <p>** This E-mail was Automatically Generated by the ${company} System **</p>
    <p>** An Administrator requested ${user.email} to create an account with ${company}**</p>
    <p>** If you believe this E-mail is a mistake please ignore it **</p>`;
};

module.exports.authUrl = function(){
  return process.env.SYSTEM_HOST_URL;
};

module.exports.authSubject = function(company){

    return `${company} Account Verified`;

};

module.exports.authBody = function(user,company,url){

    return `<p>${user.firstname},</p>
    <p><b>Account Successfully Verified and Created</b></p>
    <p><pre>Your ${company} account associated with this email was successfully created!</pre></p>
    <p><a href=${url}>Click Here</a> to go to the Login Screen:</p>
    <p>Thanks, </p>
    <p>${company} Team</p>
    <br>
    <p>** This E-mail was Automatically Generated by the ${company} System **</p>
    <p>** An Administrator requested ${user.email} to create an account with ${company}**</p>
    <p>** If you believe this E-mail is a mistake please ignore it **</p>`;

};

module.exports.projectAddBody = function(user,project,company) {
    return `<p>${user.firstname},</p>
    <p><b>You Have Been Added to Project ${project}:</b></p>
    <pre><p>An Administrator has added you to view or work on Project ${project}</p></pre>
    <p>${company} Team</p>
    <br>
    <p>** This E-mail was Automatically Generated by the ${company} System **</p>
    <p>** If you believe this E-mail is a mistake please ignore it **</p>`
};

module.exports.folderAddBody = function(user,project,folder,company) {
    return `<p>${user.firstname},</p>
    <p><b>You Have Been Added to Folder ${folder}:</b></p>
    <p><pre>An Administrator has added you to view or work on Folder ${folder}.</pre></p>
    <pre><p>${folder} is located within Project ${project}</p></pre>
    <p>${company} Team</p>
    <br>
    <p>** This E-mail was Automatically Generated by the ${company} System **</p>
    <p>** If you believe this E-mail is a mistake please ignore it **</p>`
};
