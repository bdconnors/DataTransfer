class ModalContent{
    
    constructor(){

    }

    make(header,body,footer){
        let template =  `<div style="background-color:#343a40;  padding:35px 50px;"  class="modal-header text-center">
            <div class="center">
            <h4  style="background-color:#343a40; color:#f8f9fa;" id="modalHeader">`;
        template+= header;
        template+=`</h4>
            </div>
            <div class="text-right">
            <button type="button" class="close" onclick="modal.hide()">&times;</button>
        </div>
        </div>
        <div style="padding:40px 50px;"  class="modal-body">
            <div class="button-width center" id="modalBody">`;
        template+=body;
        template+=`</div>
            </div>
            <div style="padding:35px 50px;" class="modal-footer">
            <div id="modalFooter" class="button-width center">`;
        template+=footer;
        template+=`</div>
            </div>`;
        return template;
    }
    
}