class InviteUserContent extends ModalContent {
    constructor() {
        super();
       
    }
    get(){
        return super.make(this.getHeader(),this.getBody(),this.getFooter());
    }

    getHeader() {
        return `<i class="fa fa-user-plus"></i> Add User`;
    }

    getBody() {
        let template = `<div class="center text-center" id="usersAddedStatus">
                <h5><i class="fa fa-user-circle"></i> Users Added To Project</h5>
                <div class="center text-center">`;
        if (modal.functionControl.invitedUsers.length === 0) {
            console.log(modal.functionControl.invitedUsers.length === 0);
            template += `<p style="font-style:italic">No Users Added</p>`
        } else {

            modal.functionControl.invitedUsers.forEach((user) => {
                template += `<b>${user.firstname} ${user.lastname}</b>
                        <input type="button" value ="Remove" onclick="" name="${modal.functionControl.project.id}" id="${user.id}" style="font-size:14px;" class="btn btn-danger button"></button>`;
            });
        }
        template += `</div></div>`;
        return template;
    }

    getFooter() {
        return `<button type="button"  onclick="modal.display('permissions new user')" class="btn btn-outline-dark btn-block button "><i class="fa fa-envelope"></i> Invite New</button>
                <br>
                <button type="button"  class="btn btn-outline-dark btn-block button"><i class="fa fa-user"></i> Invite Existing</button>`;
    }
}