function showUserSelect(){
    document.getElementById('userSelectDiv').style.display = 'block';
}

$('#createProjButton').click(function () {

    let createProj = $('#createProj');

    if(createProj.is(':hidden')){
        createProj.show();
    }else if(createProj.is(':visible')){
        createProj.hide();
    }
});

function selectUser(e){
    let user = e.options[e.selectedIndex].value;
    console.log(user);

}


function validate(){

    let valid = false;

    let firstNameInp = document.getElementById('firstname');
    let firstname = firstNameInp.value;

    if(firstname === ''){
        firstNameInp.style.backgroundColor = 'pink';
        let fnErr = document.getElementById('fnErr');
        fnErr.style.display = 'block';
    }

    let lastNameInp = document.getElementById('lastname');
    let lastname = lastNameInp.value;

    if(lastname === ''){
        lastNameInp.style.backgroundColor = 'pink';
        let lnErr = document.getElementById('lnErr');
        lnErr.style.display = 'block';
    }

    let emailInp = document.getElementById('email');
    let email = emailInp.value;

    if(!/^[^\s@]+@[^\s@]+[^\s@]+$/.test(email)) {

        emailInp.style.backgroundColor = 'pink';
        let err = document.getElementById('emailErr');
        err.style.display = 'block';

    }else{

        valid = true;

    }

    return valid;

}
function checkFnInput(element){
    document.getElementById('fnErr').style.display = 'none';
    element.style.backgroundColor = "";
}
function checkLnInput(element){
    document.getElementById('lnErr').style.display = 'none';
    element.style.backgroundColor = "";
}
function checkEmailInput(element){
    document.getElementById('emailErr').style.display = 'none';
    element.style.backgroundColor = "";
}