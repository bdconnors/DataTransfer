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
        let template =`<div class="center text-center" id="usersAddedStatus">
                <h5><i class="fa fa-user-circle"></i> Existing Users</h5>
                <div class="center text-center">
                    <select class="form-control" name="existingUserSelect" id="existingUserSelectInput">`;
                        template +=`<option value="none" style="font-style:italic">None</option>`;
                        modal.functionControl.existingUsers.forEach(user => {
                            let alreadyAMember = false;
                            user.projectPermissions.forEach(perm=>{
                                    if(perm.projectId === modal.functionControl.project.id){alreadyAMember = true;}

                                });
                            if(!alreadyAMember){
                                template += `<option id="${user.firstname} ${user.lastname}"  value="${user.id}">${user.firstname} ${user.lastname}</option>`;
                            }
                        });
                template +=`</select></div></div>`;
                    return template;
    }
    getFooter(){

        let template =  `<button type="button" id="existing" onclick="modal.display('set permissions',this)" class="btn btn-outline-dark btn-block button "><i class="fa fa-arrow-left"></i> Back</button>
                <br><button type="button"  onclick="modal.perform('confirm existing','existingUserSelectInput')" class="btn btn-outline-dark btn-block button "><i class="fa fa-user-plus"></i> Invite</button>`;
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
        return `<button type="button" onclick="modal.perform('invite users')" class="btn btn-outline-dark btn-block" ><i class="fa fa-user-plus"></i>Add Another User</button>
                <button type="button" onclick="modal.hide()" class="btn btn-outline-dark btn-block" ><i class="fa fa-power-off"></i>Done</button>`;
    }
}