class Server {

    constructor(){}

    async send(request) {
        return await $.ajax(request);
    }

    make(url, type, data) {
        let req = {
            url: url,
            type: type,
            success: (data)=> {
                return data
            },
            error: (e)=> {
                console.log(e);
                return false;
            }
        };
        if (data != null) {
            req.data = data;
        }
        return req;
    }
}
