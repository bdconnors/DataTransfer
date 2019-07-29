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
        }
        return super.make(header,body,footer);
    }
    getHeader() {
        return `<i class="fa fa-folder"></i> Create New Folder`;
    }

    getBody() {

    return `<div class="form-group">
                <label for="newFolderName"><i class="fa fa-user"></i> Folder Name:</label>
                <input type="text" class="form-control"  name="foldername" id="newFolderName" placeholder="Folder Name">
            </div>`

    }

    getFooter() {
        return `<button type="button" onclick="modal.perform('new folder')" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Create</button>`;
    }
    getSuccessHeader(){
        return `<i class="fa fa-archive"></i>New Folder Created`;
    }
    getSuccessBody(){

        let template = `<div style="font-size:16px;" class="text-left center">
                        <b>Project Name:</b>`;
        template+= modal.functionControl.newFolder.projectName;
        template+=`<br>
                        <b>Folder Created:</b>
                        <br>
                        ${modal.functionControl.newFolder.name}
                        </div>`;
        return template;
    }
    getSuccessFooter() {
        return `<button type="button" onclick="modal.display('folder add user')" class="btn btn-outline-dark btn-block button "><i class="fa fa-user-plus"></i> Add Users</button>
                <br>
                <button type="button" onclick="modal.hide()" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Done</button>`;
    }


}