class Date_Util{

    constructor(){}

    getCurrentDate(){

        const date = new Date();
        let month =date.getMonth();
        month += 1;

        return month+'-'+date.getDay()+'-'+date.getFullYear();
    }
}
module.exports= {Date_Util:Date_Util};