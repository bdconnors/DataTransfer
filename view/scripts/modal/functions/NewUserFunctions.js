class NewUserFunctions{
    constructor(){}
    async sendInvite(project,folderPermissions){
        let userObject = await this.createUserObject(project,folderPermissions);
        if(userObject) {
            modal.showLoadingSpinner();
            let response = await server.send(server.make('/users/invite', 'POST', userObject));
            modal.hideLoadingSpinner();
            return response;
        }
    }
    async createUserObject(project,folderPermissions){
        let firstNameInp = document.getElementById('newUserFirstname');
        let lastNameInp = document.getElementById('newUserLastname');
        let emailInp =  document.getElementById('newUserEmail');
        let valid = await this.validated(firstNameInp,lastNameInp,emailInp);
        if(valid){
            return {
                firstname:firstNameInp.value,
                lastname:lastNameInp.value,
                email:emailInp.value,
                projectPermissions:[{
                    projectId:project.id,
                    projectName:project.name,
                    folderPermissions: folderPermissions
                }]
            }
        }else{
            return false;
        }
    }

    async validated(firstNameInp,lastNameInp,emailInp){
        let valid = false;
        let firstname = firstNameInp.value;

        if(firstname === ''){
            firstNameInp.style.backgroundColor = 'pink';
            let fnErr = document.getElementById('fnErr');
            fnErr.style.display = 'block';
        }

        let lastname = lastNameInp.value;

        if(lastname === ''){
            lastNameInp.style.backgroundColor = 'pink';
            let lnErr = document.getElementById('lnErr');
            lnErr.style.display = 'block';
        }

        let email = emailInp.value;

        if(!/^[^\s@]+@[^\s@]+[^\s@]+$/.test(email)) {
            emailInp.style.backgroundColor = 'pink';
            let err = document.getElementById('emailErr');
            err.style.display = 'block';
        }else{
            let userExists = await server.send(server.make('/users/'+email+'/exists','GET'));
            console.log(userExists);
            if(userExists){
                valid = false;
                let err = document.getElementById('userExistsErr');
                emailInp.style.backgroundColor = 'pink';
                err.style.display = 'block';
            }else{
                valid = true;
            }
        }

        return valid;
    }
    checkFnInput(element){
        document.getElementById('fnErr').style.display = 'none';
        element.style.backgroundColor = "";
    }
    checkLnInput(element){
        document.getElementById('lnErr').style.display = 'none';
        element.style.backgroundColor = "";
    }
    checkEmailInput(element){
        document.getElementById('emailErr').style.display = 'none';
        element.style.backgroundColor = "";
    }
}