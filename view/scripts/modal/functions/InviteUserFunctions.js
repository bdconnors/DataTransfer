class InviteUserFunctions{
    constructor(){}

    async getInvitedUsers(projectId){
        let url ='/users/project';
        let data ='id='+projectId;
        let req = server.make(url,'GET',data);
        return await server.send(req);
    }

}