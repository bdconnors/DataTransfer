function validate(){

    let valid = true;

    const password = document.getElementById('password');
    password.style.backgroundColor = "transparent";

    const retype = document.getElementById('retype');
    retype.style.backgroundColor = "transparent";

    const length = RegExp('^.{6,}$');
    const lengthTag = document.getElementById('length');
    lengthTag.style.color = "black";

    const uppercase = RegExp('/*[A-Z]');
    const uppercaseTag = document.getElementById('uppercase');
    uppercaseTag.style.color = "black";

    const lowercase = RegExp('/*[a-z]');
    const lowercaseTag = document.getElementById('lowercase');
    lowercaseTag.style.color = "black";

    const number = RegExp('/*[0-9]');
    const numberTag = document.getElementById('number');
    numberTag.style.color = "black";

    const special = RegExp('[#$@!%&*?]');
    const specialTag = document.getElementById('special');
    specialTag.style.color = "black";


    if(!password.value){
        password.style.backgroundColor = "pink";
        valid = false;
    }
    if(!retype.value){
        retype.style.backgroundColor = "pink";
        valid = false;
    }
    if(!length.test(password.value)){
        lengthTag.style.color = "red";
        valid = false;
    }
    if(!uppercase.test(password.value)){
        uppercaseTag.style.color = "red";
        valid = false;
    }
    if(!lowercase.test(password.value)){
        lowercaseTag.style.color = "red";
        valid = false;
    }
    if(!number.test(password.value)){
        numberTag.style.color = "red";
        valid = false;
    }
    if(!special.test(password.value)){
        specialTag.style.color = "red";
        valid = false;
    }
    if(password.value !== retype.value){
        let error = document.getElementById('passError');
        clearChildren(error);
        password.style.backgroundColor = "pink";
        retype.style.backgroundColor = "pink";
        error.appendChild(document.createTextNode('*Passwords Do Not Match'));
        error.style.color = "red";
        error.style.display = "block";
        valid = false;
    }
    return valid;
}
function showForgotModal(){
    $('#forgotResponseEmail').empty();
    $('#forgotModal').modal();
}
function hideForgotModal(){
    $('#forgotModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}
function showForgotResponseModal(){
    $('#forgotResponseModal').modal();
}
function hideForgotResponseModal(){
    $('#forgotResponseModal').modal('hide');
    hideForgotModal();
}
function showForgotLoadingSpinner(){
    $('#forgotLoadingSpinner').modal();
}
function hideForgotLoadingSpinner(){
    $('#forgotLoadingSpinner').modal('hide');
}
async function passwordRecovery(){
    showForgotLoadingSpinner();
    let email = document.getElementById('forgotEmail').value;
    let server = new Server();
    $('#forgotResponseEmail').append(email);
    await server.send(server.make('/users/recovery','POST','email='+email)).catch(err=>{console.log(err)});
    hideForgotLoadingSpinner();
    showForgotResponseModal();

}
function clearChildren(element){

    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

}
function checkInput(element){
    document.getElementById('accountErr').style.visibility ="hidden";
    element.style.backgroundColor = "";
}