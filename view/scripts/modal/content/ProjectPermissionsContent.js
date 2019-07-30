class ProjectPermissionsContent extends ModalContent{
    constructor(){
        super();
    }
    getHeader() {
        return `<i class="fa fa-eye"></i> Edit Permissions`;
    }

    getBody() {
        let template = `<div class="center text-center" id="usersAddedStatus">
                <h5><i class="fa fa-user-circle"></i> Current Project Users</h5>
                <div class="center text-center">`;
        if (modal.functionControl.newFolderUsers.length === 0) {
            console.log(modal.functionControl.newFolderUsers.length === 0);
            template += `<p style="font-style:italic">No Users Added</p>`
        } else {

            modal.functionControl.newFolderUsers.forEach((user) => {
                template += `<b>${user.firstname} ${user.lastname}</b>
                        <input type="button" value ="Remove" id="${user.id}" onclick="modal.perform('project permission remove',this)" style="font-size:14px;" class="btn btn-danger button"></button>`;
            });
        }
        template += `</div></div>`;
        return template;
    }

    getFooter() {
        return `<button type="button"  id="new" onclick="modal.display('folder select user')" class="btn btn-outline-dark btn-block button "><i class="fa fa-user-plus"></i> Add User</button>
                <button type="button"  onclick="modal.hide()" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Done</button>`;
    }
}