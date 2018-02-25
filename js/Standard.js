class Standard
{
    constructor(data)
    {
        this.id = data.id;

    }

    serialize()
    {
        var data = {};

        data.id = this.id;

        return data;
    }
}
