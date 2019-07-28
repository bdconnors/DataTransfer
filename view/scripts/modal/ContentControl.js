class ContentControl{
    constructor(project,invite,newUser,permission){
        this.project = project;
        this.invite = invite;
        this.newUser = newUser;
        this.permission = permission;
    }

    show(content){

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
        }else if(content === 'permissions new user'){
            template = this.permission.get('new');
        }

        $modalContent.append(template);
        $('#modal').modal('show');
    }

}
