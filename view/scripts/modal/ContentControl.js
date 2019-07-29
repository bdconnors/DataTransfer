class ContentControl{
    constructor(project,invite,newUser,existingUser,permission,newFolder,folderAddUsers){
        this.project = project;
        this.invite = invite;
        this.newUser = newUser;
        this.existingUser = existingUser;
        this.permission = permission;
        this.newFolder = newFolder;
        this.folderAddUsers = folderAddUsers;
    }

    show(content,element){

        let template;
        let $modalContent = $('#modalContent');
        $modalContent.empty();

        if(content === 'create project'){
            template = this.project.get('create');
        }else if(content === 'create project success'){
            template = this.project.get('success');
        }else if(content === 'invite users'){
            template = this.invite.get();
        }else if(content === 'invite new user'){
            template = this.newUser.get('invite');
        }else if(content === 'new user success'){
            template = this.newUser.get('success');
        }else if(content === 'set permissions'){
            template = this.permission.get(element.id);
        }else if(content === 'invite existing user'){
            template = this.existingUser.get('invite');
        }else if(content === 'existing user success'){
            template = this.existingUser.get('success');
        }else if(content === 'new folder'){
            template = this.newFolder.get('create');
        }else if(content === 'new folder success'){
            template = this.newFolder.get('success');
        }else if(content === 'folder add user'){
            template = this.folderAddUsers.get('add');
        }else if(content === 'folder select user'){
            template = this.folderAddUsers.get('select');
        }else if(content === 'folder add user success'){
            template = this.folderAddUsers.get('success');
        }
        $modalContent.append(template);
        $('#modal').modal({backdrop: 'static', keyboard: false});
    }

}
