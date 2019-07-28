class ProjectContent extends ModalContent{
    constructor(){
        super();
    }
    get(type){
        let header;
        let body;
        let footer;
        if(type === 'create'){
            header = this.getHeader();
            body = this.getBody();
            footer = this.getFooter();
        }else if(type === 'success'){
            header = this.getSuccessHeader();
            body = this.getSuccessBody();
            footer = this.getSuccessFooter();
        }
        return super.make(header,body,footer);
    }
    
    getHeader(){
        return `<i class="fa fa-archive"></i>Create New Project`;
    }
    getBody(){
        return `
                 <div class="text-left">
                    <label for="name"><i class="fa fa-pencil"></i> <b>Project Name:</b></label>
                 </div>
                 <div class="text-center">
                     <input type="text" class="form-control" name="name" id="createProjectName" placeholder="Project Name">
                 </div>`;
    }
    getFooter(){
        return `<button type="button" onclick="modal.perform('create project')" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Create</button>`;
    }
    getSuccessFooter(){
        return `<button type="button" onclick="modal.perform('invite users')" class="btn btn-outline-dark btn-block button "><i class="fa fa-user-plus"></i> Invite Users</button>
                <button type="button" onclick="modal.hide()" class="btn btn-outline-dark btn-block button "><i class="fa fa-power-off"></i> Done</button>`;
    }
    getSuccessHeader(){
        return `<i class="fa fa-archive"></i>New Project Created`;
    }
    getSuccessBody(){

        let template = `<div style="font-size:16px;" class="text-left center">
                        <b>Project Name:</b>`;
            template+= modal.functionControl.project.name;
            template+=`<br>
                        <b>Folders Created:</b>
                        <br>`;
        modal.functionControl.project.folders.forEach(folder=>{
            template += `<i class="fa fa-folder-open"></i> ${folder.name}<br>`;
        });
        template += `</div>`;
        return template;
    }
}