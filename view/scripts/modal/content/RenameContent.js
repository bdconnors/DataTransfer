class RenameContent extends ModalContent{

    constructor(){
        super();
    }
    get(element){
        let obj = JSON.parse(JSON.stringify(element));
        this.jsonObj = obj;

        return super.make(this.getHeader(this.jsonObj.type),this.getBody(this.jsonObj.type,this.jsonObj.name),this.getFooter(this.jsonObj.type));
    }
    getHeader(type){
        return `<i class="fa fa-archive"></i>Rename ${type}`;
    }
    getBody(type,name){
        let template = `<div class="text-left">
                        <label><i class="fa fa-pencil"></i> <b>Current ${type} Name:</b></label> ${name}
                    </div>
                    <br>
                    <div class="text-left">
                        <p id="existsErr" style="color:red; display:none">*A ${type} With This Name Already Exists</p>
                        <label for="name"><i class="fa fa-pencil"></i> <b>New ${type} Name:</b></label>
                    </div>`;
                    template+=`<input type="hidden" id="renameType" value="${this.jsonObj.type}">`;
                    template+=`<input type="hidden" id="oldName" value="${this.jsonObj.name}">`;

                    template +=`<div class="text-center">
                        <input type="text" class="form-control" name="name" id="renameInput" placeholder="New ${type} Name">
                    </div>`;
                    return template;
    }
    getFooter(type){
        return `<button type="button" onclick="modal.perform('confirm rename','${type}')" class="btn btn-outline-dark btn-block button "><i class="fa fa-pencil"></i> Rename</button>`;
    }
}