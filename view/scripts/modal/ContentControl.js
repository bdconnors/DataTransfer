class ContentControl{
    constructor(){

    }

    show(content,element){

        let template;
        let $modalContent = $('#modalContent');
        $modalContent.empty();

        if(content === 'create project'){
            template = projectDisplay.get('create');
        }else if(content === 'create project success'){
            template = projectDisplay.get('success');
        }else if(content === 'invite users'){
            template = inviteDisplay.get();
        }else if(content === 'invite new user'){
            template = newUserDisplay.get('invite');
        }else if(content === 'new user success'){
            console.log('in new user success');
            template = newUserDisplay.get('success');
        }else if(content === 'set permissions'){
            template = permissionsDisplay.get(element.id);
        }else if(content === 'invite existing user'){
            template = existingUsersDisplay.get('invite');
        }else if(content === 'existing user success'){
            template = existingUsersDisplay.get('success');
        }else if(content === 'new folder'){
            template = newFolderDisplay.get('create');
        }else if(content === 'upload file'){
            template = uploadFileDisplay.get();
        }else if(content === 'rename'){
            template = renameDisplay.get(element);
        }else if(content === 'new folder success'){
            template = newFolderDisplay.get('success');
        }else if(content === 'new folder invite'){
            template = newFolderDisplay.get('invite');
        }else if(content ==='new folder invite success'){
            template = newFolderDisplay.get('invite success');
        }
        $modalContent.append(template);
        modal.hideConfirmModal();
        $('#modal').modal({backdrop: 'static', keyboard: false});
    }

}
