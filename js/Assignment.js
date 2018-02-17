class Assignment
{
    constructor(name, deadlineTime, deadlineDate, description)
    {
        this.name = name;
        this.deadlineTime = deadlineTime;
        this.deadlineDate = deadlineDate;
        this.description = description;
    }

    serialise() {
        var data = {};
        data.name = this.name;
        data.deadline_time = this.deadlineTime;
        data.deadline_date = this.deadlineDate;
        data.description = this.description;
        return data;
    }

    deserialise(data)
    {
        this.name = data.name;
        this.deadlineTime = data.deadline_time;
        this.deadlineDate = data.deadline_date;
        this.description = data.description;
    }
}
