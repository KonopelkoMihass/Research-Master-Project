
class Students extends Model
{
    constructor()
    {
        super();
        this.students = [];
    }

    getStudents()
    {

        app.net.sendMessage("get_students", {});
    }

    invertSystems()
    {

         app.net.sendMessage("invert_systems", {});
    }

    enableSystemSwitch()
    {

         app.net.sendMessage("enable_system_switch", {});
    }



    update(data, messageType)
    {
         if (messageType === app.net.messageHandler.types.SIGN_IN_SUCCESSFUL)
         {
             this.getStudents();
         }

         if (messageType === app.net.messageHandler.types.GET_STUDENTS_SUCCESSFUL ||
             messageType === app.net.messageHandler.types.INVERT_SYSTEMS_SUCCESSFUL ||
             messageType === app.net.messageHandler.types.ENABLE_SYSTEM_SWITCH_SUCCESSFUL)
         {
             this.students = data;
         }


        this.notify(messageType);
    }

}
