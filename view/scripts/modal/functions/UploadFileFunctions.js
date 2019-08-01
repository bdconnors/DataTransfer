class UploadFileFunctions{
    constructor(){}

    async uploadFile(){
        let projectId = this.getProjectId();
        let folderId = this.getFolderId();
        let file = document.getElementById('fileInput').files[0];
        let size = file.size;
        let path = document.getElementById('fileInput').value;
        let name = path.split(/(\\|\/)/g).pop();
        let exists = await server.send(server.make('/projects/project/'+projectId+'/folders/folder/'+folderId+'/file/'+name+'/exists'));
        if(exists === true||exists === 'true'){
            document.getElementById('fileExistsErr').style.display = 'block';
        }else if(exists === 'false'||exists === false){
            let reader = new FileReader();
            let $progressModal = $('#progressModal');
            $progressModal.modal({backdrop: 'static', keyboard: false});
            let $progressBar = $('.progress-bar')[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
                let data = reader.result;
                $.ajax({
                    xhr: () => {
                        let xhr = new window.XMLHttpRequest();
                        xhr.upload.addEventListener("progress", (evt) => {
                            if (evt.lengthComputable) {
                                let percentComplete = evt.loaded / evt.total * 100;
                                let percent = Math.ceil(percentComplete) + '%';
                                $progressBar.innerHTML = percent;
                                $progressBar.style.width = percent;
                            }
                        }, false);

                        return xhr;
                    },
                    url: "/projects/folders/upload",
                    type: 'POST',
                    data: {name: name, data: data, size: size, projectId: projectId, folderId: folderId},
                    success: (data) => {
                        $progressBar.innerHTML = '0%';
                        $progressBar.style.width = '0%';
                        $progressModal.modal('hide');
                        modal.hide();
                    }
                });
            };
        }

    }
    confirmDelete(element){
        let text = 'Confirm Delete File';
        let body = `<p>Delete File ${element.id}?</p>`;
        let confirmFunction = 'delete file';
        modal.showConfirmModal(text,body,confirmFunction,element);
    }
    async deleteFile(element){
        let projectId=this.getProjectId();
        let folderId = this.getFolderId();
        let fileName = element.id;
        return await server.send(server.make('/projects/project/'+projectId+'/folders/folder/'+folderId+'/file/'+fileName+'/delete','POST'));
    }
    getProjectId(){
        let url = window.location.href.split('/');
        return url[5];
    }
    getFolderId(){
        let url = window.location.href.split('/');
        return url[8].replace('#','');
    }
    checkFileInp(){
        document.getElementById('fileExistsErr').style.display = 'none';
    }
}