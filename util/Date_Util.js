class Date_Util{

    constructor(){}

    getCurrentDate(){
        const date = new Date();

        return date.getMonth()+'-'+date.getDay()+'-'+date.getFullYear();
    }
}
module.exports= {Date_Util:Date_Util};