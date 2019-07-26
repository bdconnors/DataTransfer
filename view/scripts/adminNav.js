class CreateProjectContent{
    constructor(){}

    getCreateProjectHeader(){
        return `<h2><i class="fa fa-archive"></i>Create New Project</h2>`;
    }
    getCreateProjectBody(){
        return `
                 <div class="text-left">
                    <label for="name"><i class="fa fa-pencil"></i> <b>Project Name:</b></label>
                 </div>
                 <div class="text-center">
                     <input type="text" class="form-control" name="name" id="createProjectName" placeholder="Project Name">
                 </div>`;
    }
    getCreateProjectFooter(){
        return `<button type="button" onclick="modalFunctions.createProject()" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Create</button>`;
    }
    getCreateProjectSuccessFooter(){
        return `<button type="button" onclick="modalFunctions.showInviteUsers()" class="btn btn-outline-dark btn-block button "><i class="fa fa-user-plus"></i> Invite Users</button>
                <button type="button" onclick="modalFunctions.done()" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Done</button>`;
    }
    getCreateProjectSuccessHeader(){
        return `<i class="fa fa-archive"></i>New Project Created`;
    }
    getCreateProjectSuccessBody(project){

        let template = `<div style="font-size:16px;" class="text-left center">
                        <b>Project Name:</b>${project.name}
                        <br>
                        <b>Folders Created:</b>
                        <br>`;
                        project.folders.forEach(folder=>{
                            template += `<i class="fa fa-folder-open"></i> ${folder.name}<br>`;
                        });
                 template += `</div>`;
        return template;
    }
}
class AddUsersContent{
    constructor(){}


    getInviteUserHeader(){
        return`<i class="fa fa-user-plus"> Add User`;
    }
    getInviteUserBody(users,project){
        let template = `<div class="center text-center" id="usersAddedStatus">
                <h5><i class="fa fa-user-circle"></i> Users Added To Project</h5>
                <div class="center text-center">`;
                if(users.length === 0){
                    console.log(users.length === 0);
                    template += `<p style="font-style:italic">No Users Added</p>`
                }else{

                    users.forEach((user)=>{template+=`<b>${user.firstname} ${user.lastname}</b>
                        <input type="button" value ="Remove" onclick="modalFunctions.removeUserPermission(this)" name="${project.id}" id="${user.id}" style="font-size:14px;" class="btn btn-danger button"></button>`;
                    });
                }
                template+=`</div></div>`;
        return template;
    }
    getInviteUserFooter(){
        return `<button type="button"  onclick="modalFunctions.showSetNewUserPermissions()" class="btn btn-outline-dark btn-block button "><i class="fa fa-envelope"></i> Invite New</button>
                <br>
                <button type="button"  class="btn btn-outline-dark btn-block button"><i class="fa fa-user"></i> Invite Existing</button>`;
    }
    getInviteNewHeader(){
        return`<i class="fa fa-envelope"> Invite New User`;
    }
    getInviteNewBody(){
        return`<div id="loadingSpinner" class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-sm modal-dialog-centered">
                    <div class="modal-content">
                        <div style="padding:35px 50px;" class="center modal-header">
                            <h6>Sending Invite</h6>
                        </div>
                        <div style="padding:40px 50px;" class="modal-body center text-center">
                            <span class="sr-only">Sending Invite</span>
                            <i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                        </div>
                         <div style="padding:35px 50px;" class="modal-footer"></div>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <p id="fnErr" style="color:red; display:none">*Please Enter a First Name</p>
                <label for="firstname"><i class="fa fa-user"></i> First Name:</label>
                <input type="text" onchange="checkFnInput(this)" class="form-control"  name="firstname" id="newUserFirstname" placeholder="ex: John">
            </div>
            <div class="form-group">
                <p id="lnErr" style="color:red; display:none">*Please Enter a Last Name</p>
                <label for="lastname"><i class="fa fa-user"></i> Last Name:</label>
                <input type="text" onchange="checkLnInput(this)"class="form-control" name="lastname" id="newUserLastname" placeholder="ex: Doe">
            </div>
            <div class="form-group">
                <p id="emailErr" style="color:red; display:none">*Please Enter a Valid E-mail Address</p>
                <label for="email"><i class="fa fa-envelope"></i> E-mail:</label>
                <input type="text" onchange="checkEmailInput(this)" class="form-control"  name="email" id="newUserEmail" placeholder="ex: user@domain.net">
            </div>`;
    }
    getInviteNewFooter(){

        return `<button type="button" onclick="modalFunctions.backToNewUserPermissions()" class="btn btn-outline-dark btn-block button "><i class="fa fa-arrow-left"></i> Back</button>
                <br>
                <button type="button"  onclick="modalFunctions.inviteNewUser()" class="btn btn-outline-dark btn-block button "><i class="fa fa-envelope"></i> Invite</button>`;
    }
    getInviteNewSuccessHeader(){
        return`<i class="fa fa-envelope"> Invite Sent`;
    }
    getInviteNewSuccessBody(user){
        return `<h3>An Invitation E-mail has been sent to: </h3>
                <br>
                <p><b>Name:</b> ${user.firstname} ${user.lastname}</p>
                <p><b>E-mail:</b> ${user.email}</p>`
    }
    getInviteNewSuccessFooter(){
        return   `<button type="button" onclick="modalFunctions.backToInviteUsers()" class="btn btn-outline-dark btn-block" ><i class="fa fa-user-plus"></i>Add Another User</button>
                  <button type="button" onclick="modalFunctions.done()" class="btn btn-outline-dark btn-block" ><i class="fa fa-power-off"></i>Done</button>`;
    }
    getPermissionsHeader(){
        return`<i class="fa fa-eye"> New User Permissions`;
    }
    getPermissionsBody(project){
        let folders = project.folders;
        let template = `<br><div class="row">
                      
                        <div id="userPermsDiv" class="col center">
                    <h5><b><i class = "fa fa-file"></i> Data Access Level:</b></h5>
                    <label for="view"><span style="color:green; font-size:20px;" id="viewLabel" ><i class = "fa fa-eye"></i></span> <b>View Data</b></label>
                    <input style="display: none" onclick="permissionClick()" class = "form-control" type="radio" name="userPerms"value="view" checked id="view">
                    <br>
                    <label for="download"><span style="color:red; font-size:20px;" id="downloadLabel" ><i class = "fa fa-download"></i></span> <b>View & Download Data</b></label>
                    <input style="display:none" onclick="permissionClick()" class = "form-control" type="radio" name="userPerms" value="download" id="download">
                </div>
                <br>
                <div id="folderPermsDiv" class="col center">
                 <h5><b><i class = "fa fa-folder"></i> Folder Permissions:</b></h5>`;

                    folders.forEach(folder=>{

                        template+= `<label for="${folder.name}"><span style="color:red; font-size:20px;" id="${folder.name}Label" ><i class="fa fa-folder-open"></i></span><b> ${folder.name}</b> </label>
                                <input style="display:none" type="checkbox" onclick="folderClick(this)" name="folderPerms" id="${folder.name}" value="${folder.id}"><br>`;
                    });
                template +=`</div></div>`;
                return template;
    }
    getNewUserPermissionsFooter(){
        return `<button type="button" onclick="modalFunctions.backToInviteUsers()" class="btn btn-outline-dark btn-block button "><i class="fa fa-arrow-left"></i> Back</button>
                <br>
                <button type="button"  onclick="modalFunctions.setNewUserPermissions()" class="btn btn-outline-dark btn-block button "><i class="fa fa-eye"></i> Set</button>`;
    }
}
function permissionClick(){
    let view = document.getElementById('view').checked;
    let download = document.getElementById('download').checked;
    let viewLabel = document.getElementById('viewLabel');
    let downloadLabel = document.getElementById('downloadLabel');

    if(view){
        viewLabel.style.color = "green";
        downloadLabel.style.color = 'red';
    }
    if(download){
        viewLabel.style.color = 'red';
        downloadLabel.style.color = 'green';
    }
}
function folderClick(folderInput){

    let labelId = folderInput.id+'Label';
    let label = document.getElementById(labelId);

    if(folderInput.checked){

        label.style.color = 'green';
    }
    if(!folderInput.checked){
        label.style.color = 'red';
    }
}
class ModalFunctions{

    constructor(modalID,modalHeaderId,modalBodyId,modalFooterId,createProjectContent,addUsersContent){
        this.modalID = modalID;
        this.modalHeaderId = modalHeaderId;
        this.modalBodyId = modalBodyId;
        this.modalFooterId = modalFooterId;
        this.createProjectContent = createProjectContent;
        this.addUsersContent = addUsersContent;
    }

    showCreateProject(){
        let header = this.createProjectContent.getCreateProjectHeader();
        let body = this.createProjectContent.getCreateProjectBody();
        let footer = this.createProjectContent.getCreateProjectFooter();
        this.show(header,body,footer);
    }
    async showInviteUsers(){
        let header = this.addUsersContent.getInviteUserHeader();
        let url ='/users/project';
        let data ='id='+this.newProject.id;
        let req = makeAjaxReq(url,'GET',data);
        let users = await ajaxReq(req);
        console.log(users);
        let body = this.addUsersContent.getInviteUserBody(users,this.newProject);
        let footer = this.addUsersContent.getInviteUserFooter();
        this.clearModalContent();
        this.insertModalContent(header,body,footer);
    }
    showInviteNew(){
        let header = this.addUsersContent.getInviteNewHeader();
        let body = this.addUsersContent.getInviteNewBody();
        let footer = this.addUsersContent.getInviteNewFooter();
        this.clearModalContent();
        this.insertModalContent(header,body,footer);
    }
    showInviteNewSuccess(user){

        let header = this.addUsersContent.getInviteNewSuccessHeader();
        let body = this.addUsersContent.getInviteNewSuccessBody(user);
        let footer = this.addUsersContent.getInviteNewSuccessFooter();
        this.clearModalContent();
        this.insertModalContent(header,body,footer);
    }
    showCreateProjectSuccess(){
        this.clearModalContent();
        let header = this.createProjectContent.getCreateProjectSuccessHeader();
        let body = this.createProjectContent.getCreateProjectSuccessBody(this.newProject);
        let footer = this.createProjectContent.getCreateProjectSuccessFooter();
        this.insertModalContent(header,body,footer);
    }
    async createProject(){
        console.log('calling createProject');
        let name = $('#createProjectName').val();
        let data = 'name=' + name;
        let project = await ajaxReq(makeAjaxReq('/projects/create','POST',data));
        console.log(project);
        if(project){
            this.newProject = project;
            this.showCreateProjectSuccess();
        }
    }
    showSetNewUserPermissions(){
        let header = this.addUsersContent.getPermissionsHeader();
        let body = this.addUsersContent.getPermissionsBody(this.newProject);
        let footer = this.addUsersContent.getNewUserPermissionsFooter();
        this.clearModalContent();
        this.insertModalContent(header,body,footer);
    }
    setNewUserPermissions() {
        let folderPerms = document.getElementsByName('folderPerms');
        this.curUserFolderPerms=[];
        folderPerms.forEach(perm=>{
            if(perm.checked){
                let id = perm.value;
                let name = perm.id;
                this.curUserFolderPerms.push({folderId:id,folderName:name});
            }
        });
        let userPerms = document.getElementsByName('userPerms');
        console.log(userPerms);
        userPerms.forEach(perm=>{
            console.log('check perm checked');
            console.log(perm.checked);
            if(perm.checked){
                this.curUserPerm = perm.value;
            }
        });
        this.showInviteNew();
    }
    async inviteNewUser(){
        let firstNameInp = document.getElementById('newUserFirstname');
        let lastNameInp = document.getElementById('newUserLastname');
        let emailInp =  document.getElementById('newUserEmail');
        if(validated(firstNameInp,lastNameInp,emailInp)){
            let data = {
                firstname:firstNameInp.value,
                lastname:lastNameInp.value,
                email:emailInp.value,
                projectPermissions:[]
            };
            let projectPermission = {
                projectId:this.newProject.id,
                projectName:this.newProject.name,
                folderPermissions: []
            };


            this.curUserFolderPerms.forEach(perm=>{
                let view;
                let download;

                if(this.curUserPerm === 'view'){
                    view = true;
                    download = false;
                }else if(this.curUserPerm === 'download'){
                    view = true;
                    download = true;
                }

                let folderPerm = {
                    folderId:perm.folderId,
                    folderName:perm.folderName,
                    view:view,
                    download:download
                };
                console.log(folderPerm.view);
                console.log(folderPerm.download);
                projectPermission.folderPermissions.push(folderPerm);
            });

            data.projectPermissions.push(projectPermission);

            let req = makeAjaxReq('/users/invite','POST',data);
            $('#loadingSpinner').modal('show');
            let user = await ajaxReq(req);
            if(user){
                $('#loadingSpinner').modal('hide');
                this.showInviteNewSuccess(user);
            }
        }
    }
    async removeUserPermission(elem){
        console.log('button called remove function');
        let userId = elem.id;
        let projectId = elem.name;
        let data = {id:userId,projectId:projectId};
        let req = makeAjaxReq('/users/project/permissions/remove','POST',data);
        let response = await ajaxReq(req);
        if(response.nModified === 1){
            await this.backToInviteUsers();
        }
    }
    async backToInviteUsers(){
        this.clearModalContent();
        await this.showInviteUsers();
    }
    done(){
        location.reload();
    }
    backToNewUserPermissions(){
        this.clearModalContent();
        this.showSetNewUserPermissions();
    }
    show(header,body,footer){
        this.insertModalContent(header,body,footer);
        $(this.modalID).modal('show');
    }
    hide(){
        $(this.modalID).modal('hide');
        this.clearModalContent();
    }
    clearModalContent(){
        $(this.modalHeaderId).empty();
        $(this.modalBodyId).empty();
        $(this.modalFooterId).empty();
    }
    insertModalContent(header,body,footer){
        $(this.modalHeaderId).append(header);
        $(this.modalBodyId).append(body);
        $(this.modalFooterId).append(footer);
    }

}
async function ajaxReq(request){
    return await $.ajax(request);
}
function makeAjaxReq(url,type,data) {

    let req = {
        url: url,
        type: type,
        success: function (data) {
            return data
        },
        error: function (e) {
            console.log(e);
            return false;
        }
    };
    if(data != null){
        req.data = data;
    }
    return req;
}
let addUsersContent = new AddUsersContent();
let createProjectContent = new CreateProjectContent();
let modalFunctions = new ModalFunctions(
    '#modal',
    '#modalHeader',
    '#modalBody',
    '#modalFooter',
    createProjectContent,addUsersContent
);


function validated(firstNameInp,lastNameInp,emailInp){

    let valid = false;


    let firstname = firstNameInp.value;

    if(firstname === ''){
        firstNameInp.style.backgroundColor = 'pink';
        let fnErr = document.getElementById('fnErr');
        fnErr.style.display = 'block';
    }


    let lastname = lastNameInp.value;

    if(lastname === ''){
        lastNameInp.style.backgroundColor = 'pink';
        let lnErr = document.getElementById('lnErr');
        lnErr.style.display = 'block';
    }


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