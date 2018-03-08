class Standards extends Model {
    constructor() {
        super();
        this.standards = [];
    }


    pushStandards(file)
    {

        app.net.sendMessage("push_standard", {"html_content":file});
    }


    update(data, messageType) {

    }
}