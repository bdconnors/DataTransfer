class ExistingUsersContent extends ModalContent{
    constructor(){
        super();
    }
    get(type){
        let header;
        let body;
        let footer;

        if(type === 'invite'){
            header = this.getHeader();
            body = this.getBody();
            footer = this.getFooter();
        }else if(type === 'success'){
            header = this.getSuccessHeader();
            body = this.getSuccessBody();
            footer = this.getSuccessFooter();
        }
        return super.make(header,body,footer);

    }
    getHeader(){
        return`<i class="fa fa-user"></i> Invite Existing User`;
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
                <h5><i class="fa fa-user-circle"></i> Existing Users</h5>
                <div class="center text-center">
                    <select class="form-control" name="existingUserSelect" id="existingUserSelectInput">`;
                    if(modal.functionControl.existingUsers.length === 0){
                        template +=`<option value="none" style="font-style:italic">No Users Found</option>`;
                    }else {
                        modal.functionControl.existingUsers.forEach(user => {
                            console.log(user);
                            template += `<option id="${user.id}" value="${user.id}">${user.firstname} ${user.lastname}</option>`;
                        });
                    }
                template +=`</select></div></div>`;
                    return template;
    }
    getFooter(){

        let template =  `<button type="button" id="existing" onclick="modal.display('set permissions',this)" class="btn btn-outline-dark btn-block button "><i class="fa fa-arrow-left"></i> Back</button>
                <br><button type="button"  onclick="modal.perform('invite existing user','existingUserSelectInput')" class="btn btn-outline-dark btn-block button "><i class="fa fa-user-plus"></i> Invite</button>`;
                return template;
    }

    getSuccessHeader(){
        return`<i class="fa fa-envelope"></i> Invite Sent`;
    }
    getSuccessBody(){
        return `<h3>An Invitation E-mail has been sent to: </h3>
                <br>
                <p><b>Name:</b> ${modal.functionControl.user.firstname} ${modal.functionControl.user.lastname}</p>
                <p><b>E-mail:</b> ${modal.functionControl.user.email}</p>`
    }
    getSuccessFooter(){
        return   `<button type="button" onclick="modal.perform('invite users')" class="btn btn-outline-dark btn-block" ><i class="fa fa-user-plus"></i>Add Another User</button>
                  <button type="button" onclick="modal.hide()" class="btn btn-outline-dark btn-block" ><i class="fa fa-power-off"></i>Done</button>`;
    }
}