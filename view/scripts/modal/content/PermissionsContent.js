class PermissionsContent extends ModalContent{
    constructor() {
        super();
    }
    get(type){
        let header = this.getHeader();
        let body = this.getBody();
        let footer = this.getFooter(type);

        return super.make(header,body,footer);
    }
    getHeader() {
        return `<i class="fa fa-eye"></i> Set User Invitation Permissions`;
    }

    getBody() {
        let folders = modal.functionControl.project.folders;
        let template = `

                    <br><div class="row">
                            <div id="confirmPermsModal" class="modal fade bd-example-modal-sm">
                            <div class="modal-dialog modal-sm modal-dialog-centered">
                            <div class="modal-content">
                            <div style="padding:35px 50px;" class="center modal-header">
                                <h6>Set User Permissions</h6>
                            </div>
                            <div id="confirmPermsBody" style="padding:40px 50px;" class="modal-body center text-center">
                            </div>
                            <div id="confirmPermsFooter" style="padding:35px 50px;" class="modal-footer"></div>
                            </div>
                         </div>
                    </div>
                    <div id="userPermsDiv" class="col center">
                    <h5><b><i class = "fa fa-file"></i> Data Access Level:</b></h5>
                    <label for="view"><span style="color:green; font-size:20px;" id="viewLabel" ><i class = "fa fa-eye"></i></span> <b>View Data Only</b></label>
                    <input style="display: none" onclick="modal.perform('permission click')" class = "form-control" type="radio" name="userPerms" value="view" checked id="view">
                    <br>
                    <label for="download"><span style="color:red; font-size:20px;" id="downloadLabel" ><i class = "fa fa-eye"></i> <i class = "fa fa-download"></i></span> <b>View & Download</b></label>
                    <input style="display:none" onclick="modal.perform('permission click')" class = "form-control" type="radio" name="userPerms" value="download" id="download">
                </div>
                <br>
                <div id="folderPermsDiv" class="col center">
                 <h5><b><i class = "fa fa-folder"></i> Folder Permissions:</b></h5>`;

        folders.forEach(folder => {

            template += `<label for="${folder.name}"><span style="color:red; font-size:20px;" id="${folder.name}Label" ><i class="fa fa-folder-open"></i></span><b> ${folder.name}</b> </label>
                                <input style="display:none" type="checkbox" onclick="modal.perform('folder click',this)" name="folderPerms" id="${folder.name}" value="${folder.id}"><br>`;
        });
        template += `</div></div>`;
        return template;
    }

    getFooter(type) {
        return `<button type="button" onclick="modal.perform('invite users')" class="btn btn-outline-dark btn-block button "><i class="fa fa-arrow-left"></i> Back</button>
                <br>
                <button type="button"  id="${type}" onclick="modal.perform('confirm permissions',this)" class="btn btn-outline-dark btn-block button "><i class="fa fa-eye"></i> Set</button>`;
    }

}