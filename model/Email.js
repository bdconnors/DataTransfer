class Email{
    constructor(to,from,subject,text,html){
        this.to = to;
        this.from = from;
        this.subject = subject;
        this.text = text;
        this.html = html;
    }
}
module.exports={Email:Email};