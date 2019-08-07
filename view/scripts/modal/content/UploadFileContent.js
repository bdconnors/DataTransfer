class UploadFileContent extends ModalContent{
    constructor(){
        super();
    }
    get(){
        return super.make(this.getHeader(),this.getBody(),this.getFooter());
    }
    getHeader(){
        return `<i class="fa fa-archive"></i>Upload File`;
    }
    getBody(){
        return `<div class="text-left">
                    <label for="name"><i class="fa fa-pencil"></i> <b>Select a File:</b></label>
                 </div>
                           <div id="fileExistsErr" style="display:none;">
                <p style="color:red;">*a file with the name <span id="existErrFileName"></span> already exists</p>
            </div>
                           <div id="noFileErr" style="display:none;">
                            <p style="color:red;">*Please Select at least one file to upload</p>
                       </div>
                 <div class="text-center">
                     <input type="file" class="form-control" name="fileName" id="fileInput" multiple>
                 </div>`;
    }
    getFooter(){
        return `<button type="button" onclick="modal.perform('upload file')" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Upload</button>`;
    }

}