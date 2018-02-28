class Assignment
{
    constructor(data)
    {
        this.name = data.name;
        this.deadlineTime = data.deadline_time;
        this.deadlineDate = data.deadline_date;
        this.description = data.description;
        this.id = data.id;

        this.reviewTillDate = data.review_till_date;
        this.reviewTillTime = data.review_till_time;
        this.reviewersAmounts = data.reviewers_amount;
        this.status = data.status;
    }
}
