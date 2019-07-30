class UploadFileFunctions{
    constructor(){}

    uploadFile(){
        let projectId = this.getProjectId();
        let folderId = this.getFolderId();
        console.log(projectId);
        console.log(folderId);
        let file = document.getElementById('fileInput').files[0];
        let size = file.size;
        let path = document.getElementById('fileInput').value;
        let name = path.split(/(\\|\/)/g).pop();

        let reader = new FileReader();
        let $progressModal = $('#progressModal');
        $progressModal.modal({backdrop: 'static', keyboard: false});
        let $progressBar = $('.progress-bar')[0];
        console.log($progressBar);
        reader.readAsDataURL(file);
        reader.onload = () => {
            let data = reader.result;
            console.log(data);
            $.ajax({
                xhr: ()=> {
                    let xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", (evt)=> {
                        if (evt.lengthComputable) {
                            let percentComplete = evt.loaded / evt.total * 100;
                            let percent = Math.ceil(percentComplete)+'%';
                            $progressBar.innerHTML = percent;
                            $progressBar.style.width = percent;
                        }
                    }, false);

                    return xhr;
                },
                url: "/projects/folders/upload",
                type: 'POST',
                data: {name:name,data:data,size:size,projectId:projectId,folderId:folderId},
                success: (data)=>{
                    $progressBar.innerHTML = '0%';
                    $progressBar.style.width = '0%';
                    $progressModal.modal('hide');
                    modal.hide();
                }
            });
        };


    }
    downloadFile(element){

    }
    viewFile(){

    }
    getProjectId(){
        let url = window.location.href.split('/');
        return url[5];
    }
    getFolderId(){
        let url = window.location.href.split('/');
        return url[8].replace('#','');
    }
}