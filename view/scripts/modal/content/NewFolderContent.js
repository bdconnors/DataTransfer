class NewFolderContent extends ModalContent{
    constructor() {
        super();
    }
    get(type){
        let header;
        let body;
        let footer;
        if(type === 'create') {
            header = this.getHeader();
            body = this.getBody();
            footer = this.getFooter(type);
        }else if(type === 'success'){
            header = this.getSuccessHeader();
            body = this.getSuccessBody();
            footer = this.getSuccessFooter();
        }else if(type ==='invite'){
            header = this.getInviteHeader();
            body = this.getInviteBody();
            footer = this.getInviteFooter();
        }else if(type === 'invite success'){
            header = this.getInviteSuccessHeader();
            body = this.getInviteSuccessBody();
            footer = this.getInviteSuccessFooter();
        }        return super.make(header,body,footer);
    }
    getHeader() {
        return `<i class="fa fa-folder"></i> Create New Folder`;
    }

    getBody() {

    return `<div class="form-group">
                <label for="newFolderName"><i class="fa fa-user"></i> Folder Name:</label>
                <p id="folderExistsErr" style="color:red; display:none">*A Folder With This Name Already Exists</p>
                <input type="text" class="form-control"  name="foldername" id="newFolderName" placeholder="Folder Name">
            </div>`

    }
    getFooter() {
        return `<button type="button" onclick="modal.perform('create new folder')" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Create</button>`;
    }
    getInviteHeader(){
        return`<i class="fa fa-user"></i> Folder Permissions`;
    }
    getInviteBody(){
        let template =`<div class="center text-center" id="usersAddedStatus">
                <h5><i class="fa fa-user-circle"></i> Current Folder Permissions</h5>
                <div class="center text-center">`;
        if (modal.functionControl.invitedUsers.length === 0) {
            template += `<p style="font-style:italic">No Users Added</p>`
        } else {
            modal.functionControl.invitedUsers.forEach((user) => {
                template += `<b>${user.firstname} ${user.lastname}</b>
                        <input type="button" value ="Remove" onclick="modal.perform('remove folder permission',this)" id="${user.id}" style="font-size:14px;" class="btn btn-danger button"></button><br>`;
            });
        }
        template += `</div></div>
<div class="center text-center" id="usersAddedStatus">
                <h5><i class="fa fa-user-circle"></i> Select A User To Add</h5>
                <div class="center text-center">
                    <p id="selectUserErr" style="color:red; visibility:hidden; font-size:12px;">*Please select a user</p>
                    <select class="form-control" name="existingUserSelect" id="existingUserSelectInput">`;
        template +=`<option value="none" style="font-style:italic">None</option>`;
        modal.functionControl.existingUsers.forEach(user => {
            let alreadyAMember = false;
            user.projectPermissions.forEach(perm=>{
                perm.folderPermissions.forEach(folder=>{
                        console.log(folder);
                        if(folder.folderId === functionControl.folder.id){
                            console.log('alreadyAMember');
                            alreadyAMember = true;
                        }
                    });
                console.log(alreadyAMember);
                    if(!alreadyAMember){
                        template += `<option id="${user.firstname} ${user.lastname}"  value="${user.id}">${user.firstname} ${user.lastname}</option>`;
                    }
                });

            });
        template +=`</select></div></div>`;
        return template;
    }
    getInviteFooter(){

        return `<br>
                <button type="button"  onclick="modal.perform('new folder invite user')" class="btn btn-outline-dark btn-block button "><i class="fa fa-user-plus"></i> Invite Selected</button>
                <button type="button" id="existing" onclick="modal.hide()" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Done</button>`;

    }
    getInviteSuccessHeader(){
        return`<i class="fa fa-envelope"></i> Invite Sent`;
    }
    getInviteSuccessBody(){
        return `<h3>An Invitation E-mail has been sent to: </h3>
                <br>
                <p><b>Name:</b> ${modal.functionControl.user.firstname} ${modal.functionControl.user.lastname}</p>
                <p><b>E-mail:</b> ${modal.functionControl.user.email}</p>`
    }
    getInviteSuccessFooter(){
        return `<button type="button" onclick="modal.perform('new folder invite')" class="btn btn-outline-dark btn-block" ><i class="fa fa-user-plus"></i>Add Another User</button>
                <button type="button" onclick="modal.hide()" class="btn btn-outline-dark btn-block" ><i class="fa fa-power-off"></i>Done</button>`;
    }
    getSuccessHeader(){
        return `<i class="fa fa-archive"></i>New Folder Created`;
    }
    getSuccessBody(){

        return `<div style="font-size:16px;" class="text-left center">
                        <b>Folder Created:</b>&nbsp;<i class="fa fa-folder-open"></i> ${functionControl.folder.name}<br>
                        </div>`;
    }
    getSuccessFooter(){
        return `<button type="button" onclick="modal.perform('new folder invite')" class="btn btn-outline-dark btn-block" ><i class="fa fa-eye"></i> Add/Remove Permissions</button>
                <button type="button" onclick="modal.hide()" class="btn btn-outline-dark btn-block" ><i class="fa fa-power-off"></i>Done</button>`;
    }

}