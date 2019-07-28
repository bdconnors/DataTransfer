class InviteUserFunctions{
    constructor(){}

    async getInvitedUsers(projectId){
        console.log('inside get invited users');
        let url ='/users/project';
        let data ='id='+projectId;
        let req = server.make(url,'GET',data);
        return await server.send(req);
    }

}