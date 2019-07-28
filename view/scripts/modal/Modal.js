class Modal{
    constructor(contentControl,functionControl){
        this.contentControl = contentControl;
        this.functionControl = functionControl;
    }

    display(content){
        this.contentControl.show(content);
    }
    async perform(action,element){
        this.processResponse(await this.functionControl.perform(action,element));
    }
    processResponse(response){

        if(response.display) {
            this.display(response.display);
        }
    }

    hide(){
        let $modalContent = $('#modalContent');
        $modalContent.empty();
        $('#modal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        location.reload();
    }

}