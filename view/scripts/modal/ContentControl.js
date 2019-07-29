class ContentControl{
    constructor(project,invite,newUser,existingUser,permission){
        this.project = project;
        this.invite = invite;
        this.newUser = newUser;
        this.existingUser = existingUser;
        this.permission = permission;
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
        }
        $modalContent.append(template);
        $('#modal').modal({backdrop: 'static', keyboard: false});
    }

}
