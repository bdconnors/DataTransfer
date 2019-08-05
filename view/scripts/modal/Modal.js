class Modal{
    constructor(contentControl,functionControl){
        this.contentControl = contentControl;
        this.functionControl = functionControl;

    }

    display(content,element){
        console.log('display'+content);
        this.contentControl.show(content,element);
    }
    async perform(action,element){
        this.processResponse(await this.functionControl.perform(action,element));
    }
    processResponse(response){
        console.log('inside process response');
        console.log('response');
        console.log(response);
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
    showConfirmModal(text,body,confirmFunction,confirmElement){
        console.log('inside confirm modal show');
        let $confirmModal = $('#confirmModal');
        let $confirmModalText = $('#confirmModalHeaderText');
        let $confirmModalBody = $('#confirmModalBody');
        let $confirmFooter = $('#confirmModalFooter');
        $confirmModalText.append(text);
        $confirmModalBody.append(body);

        if(confirmElement) {
            if (confirmElement.id) {
                let name = "";
                if (confirmElement.name) {
                    name = confirmElement.name;
                }
                $confirmFooter.append(`<button type="button" name="${name}" id="${confirmElement.id}" onclick="modal.perform('${confirmFunction}',this)" class="btn btn-outline-dark btn-block button confirmModalButton"><i class="fa fa-check-square-o"></i> Confirm</button>`);
            } else {
                $confirmFooter.append(`<button type="button"  onclick="modal.perform('${confirmFunction}','${confirmElement}')" class="btn btn-outline-dark btn-block button confirmModalButton"><i class="fa fa-check-square-o"></i> Confirm</button>`);
            }
        }else{
            $confirmFooter.append(`<button type="button" name="" id="" onclick="modal.perform('${confirmFunction}')" class="btn btn-outline-dark btn-block button confirmModalButton"><i class="fa fa-check-square-o"></i> Confirm</button>`);
        }
        $confirmModal.modal({backdrop: 'static', keyboard: false});
    }
    hideConfirmModal(){
        let $confirmModal = $('#confirmModal');
        let $confirmModalText = $('#confirmModalHeaderText');
        let $confirmModalBody = $('#confirmModalBody');
        $confirmModalText.empty();
        $confirmModalBody.empty();
        $('.confirmModalButton').remove();
        $confirmModal.modal('hide');
    }
    showLoadingSpinner(){
        let spinner = $('#loadingSpinner');
        spinner.modal({backdrop: 'static', keyboard: false});
    }
    hideLoadingSpinner(){
        let spinner = $('#loadingSpinner');
        spinner.modal('hide');
    }

}