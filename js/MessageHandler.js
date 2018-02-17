/**Handles messages**/
class MessageHandler
{
	constructor  ()
	{
		this.types = {
			SIGN_IN_SUCCESSFUL: "signin_successful",
			SIGN_IN_FAILED: "signin_failed",

			SIGN_UP_SUCCESSFUL: "signup_successful",
			SIGN_UP_FAILED: "signup_failed",

			TEACHER_ASSIGNMENTS_CREATION_SUCCESSFUL: "teacher_assignments_creation_successful",
			TEACHER_ASSIGNMENTS_CREATION_FAILED: "teacher_assignments_creation_failed",

			GET_ASSIGNMENTS_SUCCESSFUL: "get_assignments_successful",
			GET_ASSIGNMENTS_FAILED: "get_assignments_failed",

			ASSIGNMENT_DELETE_SUCCESSFUL: "assignment_delete_successful",
			ASSIGNMENT_DELETE_FAILED: "assignment_delete_failed",



		};
	}

	handleMessage (message)
	{

		var msg = JSON.parse(message);
		var type = msg.type;
		var data = msg.data;

		console.log("Message received:", type,"-", data);

		app.user.update(data, type);
		app.assignments.update(data, type);
	}
}
