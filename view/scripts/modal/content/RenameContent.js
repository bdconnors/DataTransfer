class RenameContent extends ModalContent{

    constructor(){
        super();
    }
    get(element){
        let obj = JSON.parse(JSON.stringify(element));
        this.jsonObj = obj;
        this.name = obj.name;
        this.type = obj.type;


        return super.make(this.getHeader(this.type),this.getProjectBody(this.type,this.name),this.getProjectFooter(obj));
    }
    getHeader(type){
        return `<i class="fa fa-archive"></i>Rename ${type}`;
    }
    getProjectBody(type,name){
        let template = `<div class="text-left">
                        <label><i class="fa fa-pencil"></i> <b>Current ${type} Name:</b></label> ${name}
                    </div>
                    <br>
                    <div class="text-left">
                        <p id="projExistsErr" style="color:red; display:none">*A Project With This Name Already Exists</p>
                        <label for="name"><i class="fa fa-pencil"></i> <b>New ${type} Name:</b></label>
                    </div>`;
                    if(this.jsonObj.projectId){
                        template+=`<input type="hidden" id="projectIdHidden" value="${this.jsonObj.projectId}">`;
                    }
                    if(this.jsonObj.folderId){
                        template+=`<input type="hidden" id="folderIdHidden" value="${this.jsonObj.folderId}">`;
                    }
                    template+=`<input type="hidden" id="renameType" value="${this.jsonObj.type}">`;
                    template+=`<input type="hidden" id="oldName" value="${this.jsonObj.name}">`;

                    template +=`<div class="text-center">
                        <input type="text" class="form-control" name="name" id="renameInput" placeholder="New ${type} Name">
                    </div>`;
                    return template;
    }
    getProjectFooter(){
        return `<button type="button" onclick="modal.perform('confirm rename project')" class="btn btn-outline-dark btn-block button "><i class="fa fa-pencil"></i> Rename</button>`;
    }
}