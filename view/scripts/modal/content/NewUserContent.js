class NewUserContent extends ModalContent{
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
        return`<i class="fa fa-envelope"></i> Invite New User`;
    }
    getBody(){
        return`<div id="loadingSpinner" class="modal fade bd-example-modal-sm">
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
                <input type="text" onchange="modal.perform('check first name',this)" class="form-control"  name="firstname" id="newUserFirstname" placeholder="ex: John">
            </div>
            <div class="form-group">
                <p id="lnErr" style="color:red; display:none">*Please Enter a Last Name</p>
                <label for="lastname"><i class="fa fa-user"></i> Last Name:</label>
                <input type="text" onchange="modal.perform('check last name',this)" class="form-control" name="lastname" id="newUserLastname" placeholder="ex: Doe">
            </div>
            <div class="form-group">
                <p id="emailErr" style="color:red; display:none">*Please Enter a Valid E-mail Address</p>
                <p id="userExistsErr" style="color:red; display:none">*An Account Associated with this E-mail Already Exists</p>
                <label for="email"><i class="fa fa-envelope"></i> E-mail:</label>
                <input type="text" onchange="modal.perform('check email',this)" class="form-control"  name="email" id="newUserEmail" placeholder="ex: user@domain.net">
            </div>`;
    }
    getFooter(){

        return `<button type="button" id="new" onclick="modal.display('set permissions',this)" class="btn btn-outline-dark btn-block button "><i class="fa fa-arrow-left"></i> Back</button>
                <br>
                <button type="button"  onclick="modal.perform('invite new user')" class="btn btn-outline-dark btn-block button "><i class="fa fa-envelope"></i> Invite</button>`;
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