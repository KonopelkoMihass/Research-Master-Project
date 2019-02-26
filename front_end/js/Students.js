
class Students extends Model
{
    constructor()
    {
        super();
        this.students = [];
    }

    getStudents(email, password)
    {
        var data = {};
        data.email = email;
        data.password = password;

        app.net.sendMessage("get_students", data);
    }

    invertSystems(groupSelected)
    {

         app.net.sendMessage("invert_systems", {group: groupSelected});
    }

    enableSystemSwitch(groupSelected)
    {
         app.net.sendMessage("enable_system_switch", {group: groupSelected});
    }

    getPerformanceData(email, raw)
    {
        app.net.sendMessage("get_student_performance", {email: email, raw:raw});
    }



    update(data, messageType)
    {
         if (messageType === app.net.messageHandler.types.SIGN_IN_SUCCESSFUL)
         {
             //if (app.user.role === "teacher")
               // this.getStudents();
         }

         if (messageType === app.net.messageHandler.types.GET_STUDENTS_SUCCESSFUL ||
             messageType === app.net.messageHandler.types.INVERT_SYSTEMS_SUCCESSFUL ||
             messageType === app.net.messageHandler.types.ENABLE_SYSTEM_SWITCH_SUCCESSFUL)
         {
             //if (app.user.role === "teacher")
                this.students = data;
         }


        this.notify(messageType);
    }

}
