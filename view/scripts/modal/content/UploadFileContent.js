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
        return `<div id="progressModal" class="modal fade bd-example-modal-sm">
                <div class="modal-dialog modal-sm modal-dialog-centered">
                    <div style="padding:10px 10px;" class="modal-content">
                    
                        <div style="padding:35px 50px;" class="center modal-header">
                            <h6>Uploading</h6>
                        </div>
                        <div id="progressDiv" class="progress">
    <div id="progressBar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:0%">
    0%
    </div>
  </div>
                         <div style="padding:35px 50px;" class="modal-footer"></div>
                    </div>
                </div>
            </div>
             <div class="text-left">
                    <label for="name"><i class="fa fa-pencil"></i> <b>Select a File:</b></label>
                 </div>
                 <div class="text-center">
                     <input type="file" class="form-control" name="fileName" accept="image/jpg, image/gif" id="fileInput" placeholder="Project Name">
                 </div>`;
    }
    getFooter(){
        return `<button type="button" onclick="modal.perform('upload file')" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Upload</button>`;
    }
}