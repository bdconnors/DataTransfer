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
                        <input type="button" value ="Remove" onclick="modal.perform('remove permission',this)" name="${modal.functionControl.project.id}" id="${user.id}" style="font-size:14px;" class="btn btn-danger button"></button>`;
            });
        }
        template += `</div></div>`;
        return template;
    }

    getFooter() {
        return `<button type="button"  id="new" onclick="modal.display('set permissions',this)" class="btn btn-outline-dark btn-block button "><i class="fa fa-envelope"></i> Invite New</button>
                <button type="button"  id="existing" onclick="modal.display('set permissions',this)" class="btn btn-outline-dark btn-block button"><i class="fa fa-user"></i> Invite Existing</button>
                <button type="button"  onclick="modal.hide()" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Done</button>`;
}
}