$('#createProjButton').click(function () {

    let createProj = $('#createProj');

    if(createProj.is(':hidden')){
        createProj.show();
    }else if(createProj.is(':visible')){
        createProj.hide();
    }
});
function resetForm(){

    document.getElementById('userSelect').value="none";
    document.getElementById('permSelectDiv').style.display='none';
    document.getElementById('folderSelectDiv').style.display='none';

}
function showPermSelect(){
    document.getElementById('permSelectDiv').style.display='table';
    document.getElementById('folderSelectDiv').style.display='table';
    showResetAddUser();
}
function showInviteAddUser(){
    document.getElementById('addInviteGroup').style.display='table';
    document.getElementById('selectPermButtGroup').style.display='none';
}
function hideInviteAddUser(){
    document.getElementById('addInviteGroup').style.display='none';
    document.getElementById('selectPermButtGroup').style.display='table';
}
function showResetAddUser(){
    document.getElementById('addInviteGroup').style.display='none';
    document.getElementById('submitResetGroup').style.display='table';
}

function checkFolder(e){
    let label = document.getElementById(e.id+'Label');
    if(!e.checked){
        label.style.color="red";
    }else{
        label.style.color="green";
        console.log(e.checked);
    }

}
function checkPermission(e){
    let viewLabel = document.getElementById('viewLabel');
    let downloadLabel = document.getElementById('downloadLabel');
    if(e.value === 'view'){
        downloadLabel.style.color='red';
        viewLabel.style.color='green';

    }else if(e.value ==='download'){
        downloadLabel.style.color='green';
        viewLabel.style.color='red';
    }
}
function resetCurrentUser(){
    document.getElementById('userSelect').value="none";
    let folderPerms = document.getElementsByName('userFolderPerms');
    folderPerms.forEach((perm)=>{
        perm.checked = false;
        let label = document.getElementById(perm.id+'Label');
        label.style.color='red';
    });
    document.getElementById('view').checked=true;
    document.getElementById('viewLabel').style.color='green';
    document.getElementById('download').checked=false;
    document.getElementById('downloadLabel').style.color='red';
    document.getElementById('permSelectDiv').style.display='none';
    document.getElementById('folderSelectDiv').style.display='none';
}
function showUserSelect(){
    document.getElementById('userSelectDiv').style.display = 'table';
    hideInviteAddUser();
}
function hideUserSelect(){
    document.getElementById('userSelectDiv').style.display = 'none';
    document.getElementById('selectPermButtGroup').style.display = 'none';
}
function showAddUsers(){
    document.getElementById('projectNameDiv').style.display='none';
    document.getElementById('addUsersDiv').style.display='table';
}
function hideAddUsers(){
    document.getElementById('projectNameDiv').style.display='table';
    document.getElementById('addUsersDiv').style.display='none';
}
function backToInviteAdd(){
    resetCurrentUser();
    hideUserSelect();
    showInviteAddUser();
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