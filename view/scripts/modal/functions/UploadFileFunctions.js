class UploadFileFunctions{
    constructor(){}
    async upload(){

        let files = document.getElementById('fileInput').files;
        let numFiles = files.length;
        let $existsErr = $('#fileExistsErr');
        $existsErr.css('display','none');
        let $noFileErr = $('#noFileErr');
        $noFileErr.css('display','none');
        let $existsErrFileName = $(`#existErrFileName`);
        let $fileNameSpan = $(`#fileNameSpan`);
        let $statusText = $('#uploadStatusText');
        let $successButton = $('#uploadStatusButton');
        let err = false;
        let reader = new FileReader();
        reader.readAsArrayBuffer(files[0]);

        if(numFiles === 0){
            $noFileErr.css('display','block');
            err = true;
        }

        if(!err) {
            for (let i = 0; i < files.length; i++) {
                err = await this.fileExists(files[i]);
                if(err){
                    $existsErrFileName.empty();
                    $existsErrFileName.append(files[i].name);
                    $existsErr.css('display','block');
                    break
                }
            }
            if (!err) {
                $statusText.empty();
                $statusText.append(`Uploading File <span id="fileIndex"></span>/<span id="numFiles"></span>`);
                let $numFilesElem = $('#numFiles');
                $numFilesElem.empty();
                $numFilesElem.append(numFiles);
                let $fileIndexElem = $('#fileIndex');
                $fileIndexElem.empty();
                $fileIndexElem.append('0');
                $successButton.css('display','none');
                this.showProgressModal();
                for (let i = 0; i < files.length; i++) {
                    $fileIndexElem.empty();
                    $fileIndexElem.append(i+1);
                    console.log(files[i].name);
                    $fileNameSpan.append(files[i].name);
                    await this.sendFile(files[i]);
                    if(i+1 !== files.length){
                        $fileNameSpan.empty();
                        this.clearProgressBarPercent('file');
                    }
                    let fileNumber = i+1;
                    let percent = fileNumber/numFiles * 100;
                    console.log(percent);
                    let percentComplete = Math.floor(percent);
                    console.log(percentComplete);
                    this.setProgressBarPercent('total',percentComplete);
                }
                $statusText.empty();
                $statusText.append(`All File(s) Uploaded Successfully`);
                $successButton.css('display','block');
            }
        }
    }
    async sendFile(file){

        let projectId = this.getProjectId();
        let folderId = this.getFolderId();
        let size = file.size;
        let name = file.name;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let data = reader.result;
            $.ajax({
                xhr: () => {
                    let xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", (evt) => {
                        if (evt.lengthComputable) {
                            let percent = evt.loaded / evt.total * 100;
                            let percentComplete = Math.floor(percent);
                            this.setProgressBarPercent('file',percentComplete);
                        }
                    }, false);

                    return xhr;
                },
                url: "/projects/folders/upload",
                type: 'POST',
                data: {name: name, data: data, size: size, projectId: projectId, folderId: folderId},
                success: (data) => {
                }
            });
        };
    }
    async fileExists(name){

        let projectId = this.getProjectId();
        let folderId = this.getFolderId();
        return await server.send(server.make('/projects/project/'+projectId+'/folders/folder/'+folderId+'/file/'+name+'/exists'));
    }
    showProgressModal(){
        this.clearProgressBarPercent('file');
        this.clearProgressBarPercent('total');
        $('#progressModal').modal({backdrop: 'static', keyboard: false});
    }
    setProgressBarPercent(bar,percent){
        let $bars = $('.progress-bar');
        if(bar === 'file'){
            console.log('file percent in set progress bar: '+percent);
            $bars[0].innerHTML = percent+'%';
            $bars[0].style.width = percent+'%';
        }else if(bar === 'total'){
            console.log('total percent in set progress bar: '+percent);
            $bars[1].innerHTML = percent+'%';
            $bars[1].style.width = percent+'%';
        }
    }
    clearProgressBarPercent(bar){
        let $bars = $('.progress-bar');
        if(bar === 'file'){
            $bars[0].innerHTML = '0';
            $bars[0].style.width = '0';
        }else if(bar === 'total'){
            $bars[1].innerHTML = '0';
            $bars[1].style.width = '0';
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
        if(url[5]) {
            return url[5];
        }
    }
    getFolderId(){
        let url = window.location.href.split('/');
        if(url[8]) {
            return url[8].replace('#','');
        }
    }
    checkFileInp(){
        document.getElementById('fileExistsErr').style.display = 'none';
    }
}