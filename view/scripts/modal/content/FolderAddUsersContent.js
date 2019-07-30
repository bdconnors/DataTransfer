class FolderAddUsersContent extends ModalContent{
    constructor(){
        super();
    }
    get(type){
        let header;
        let body;
        let footer;

        if(type === 'add') {
            header = this.getStatusHeader();
            body = this.getStatusBody();
            footer = this.getStatusFooter();
        }else if(type ==='select') {
            header = this.getHeader();
            body = this.getBody();
            footer = this.getFooter();
        }else if(type ==='success'){
            header = this.getSuccessHeader();
            body = this.getSuccessBody();
            footer = this.getSuccessFooter();
        }

        return super.make(header,body,footer);

    }
    getHeader(){
        return`<i class="fa fa-user"></i> Invite Project User`;
    }
    getBody(){
        let template =`<div id="loadingSpinner" class="modal fade bd-example-modal-sm">
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
            <div class="center text-center" id="usersAddedStatus">
                <h5><i class="fa fa-user-circle"></i> Project Users</h5>
                <div class="center text-center">
                    <select class="form-control" name="userSelected" id="folderUserSelect">`;
        if(modal.functionControl.existingUsers.length === 0){
            template +=`<option value="none" style="font-style:italic">No Users Found</option>`;
        }else {
            modal.functionControl.existingUsers.forEach(user => {
                console.log(user);
                template += `<option id="${user.id}" value="${user.id}">${user.firstname} ${user.lastname}</option>`;
            });
        }
        template +=`</select></div>
<br>
<div class="row">
                    <div id="userPermsDiv" class="col center">
                    <p><b><i class = "fa fa-file"></i> Data Access Level:</b></p>
                    <label for="view"><span style="color:green; font-size:20px;" id="viewLabel" ><i class = "fa fa-eye"></i></span> <b>View Data</b></label>
                    <input style="display: none" onclick="modal.perform('permission click')" class = "form-control" type="radio" name="userPerms" value="view" checked id="view">
                    <br>
                    <label for="download"><span style="color:red; font-size:20px;" id="downloadLabel" ><i class = "fa fa-download"></i></span> <b>View & Download Data</b></label>
                    <input style="display:none" onclick="modal.perform('permission click')" class = "form-control" type="radio" name="userPerms" value="download" id="download">
                </div>
</div>`;
        return template;
    }
    getFooter(){

        return`<br><button type="button"  onclick="modal.perform('folder add user')" class="btn btn-outline-dark btn-block button "><i class="fa fa-user-plus"></i> Add</button>`;
    }

    getSuccessHeader(){
        return`<i class="fa fa-envelope"></i> Folder Invite Sent`;
    }
    getSuccessBody(){
        return `<h3>An Invitation E-mail has been sent to: </h3>
                <br>
                <p><b>Name:</b> ${modal.functionControl.user.firstname} ${modal.functionControl.user.lastname}</p>
                <p><b>E-mail:</b> ${modal.functionControl.user.email}</p>`
    }
    getSuccessFooter(){
        return`<button type="button"  id="new" onclick="modal.display('folder add user')" class="btn btn-outline-dark btn-block button "><i class="fa fa-envelope"></i> Add Another User</button>
        <br>
         <button type="button"  onclick="modal.hide()" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Done</button>`
    }
    getStatusHeader() {
        return `<i class="fa fa-user-plus"></i> Users Added`;
    }

    getStatusBody() {
        let template = `<div class="center text-center" id="usersAddedStatus">
                <h5><i class="fa fa-user-circle"></i> Users Added To Project</h5>
                <div class="center text-center">`;
        if (modal.functionControl.newFolderUsers.length === 0) {
            console.log(modal.functionControl.newFolderUsers.length === 0);
            template += `<p style="font-style:italic">No Users Added</p>`
        } else {

            modal.functionControl.newFolderUsers.forEach((user) => {
                template += `<b>${user.firstname} ${user.lastname}</b>
                        <input type="button" value ="Remove" id="${user.id}" onclick="modal.perform('folder remove permission',this)" style="font-size:14px;" class="btn btn-danger button"></button>`;
            });
        }
        template += `</div></div>`;
        return template;
    }

    getStatusFooter() {
        return `<button type="button"  id="new" onclick="modal.display('folder select user')" class="btn btn-outline-dark btn-block button "><i class="fa fa-user-plus"></i> Add User</button>
                <button type="button"  onclick="modal.hide()" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Done</button>`;
    }
}