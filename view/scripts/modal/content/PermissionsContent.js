class PermissionsContent extends ModalContent{
    constructor() {
        super();
    }
    get(type){
        let header = this.getHeader();
        let body = this.getBody();
        let footer;
        if(type === 'new'){
            footer = this.getNewFooter();
        }else if(type === 'existing'){

        }
        return super.make(header,body,footer);
    }
    getHeader() {
        return `<i class="fa fa-eye"></i> New User Permissions`;
    }

    getBody() {
        let folders = modal.functionControl.project.folders;
        let template = `<br><div class="row">
                      
                        <div id="userPermsDiv" class="col center">
                    <h5><b><i class = "fa fa-file"></i> Data Access Level:</b></h5>
                    <label for="view"><span style="color:green; font-size:20px;" id="viewLabel" ><i class = "fa fa-eye"></i></span> <b>View Data</b></label>
                    <input style="display: none" onclick="modal.perform('permission click')" class = "form-control" type="radio" name="userPerms"value="view" checked id="view">
                    <br>
                    <label for="download"><span style="color:red; font-size:20px;" id="downloadLabel" ><i class = "fa fa-download"></i></span> <b>View & Download Data</b></label>
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

    getNewFooter() {
        return `<button type="button" onclick="" class="btn btn-outline-dark btn-block button "><i class="fa fa-arrow-left"></i> Back</button>
                <br>
                <button type="button"  onclick="modal.perform('set permissions')" class="btn btn-outline-dark btn-block button "><i class="fa fa-eye"></i> Set</button>`;
    }

}