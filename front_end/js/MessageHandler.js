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

			SUBMIT_ASSIGNMENT_SUCCESSFUL: "submit_assignment_successful",
			SUBMIT_ASSIGNMENT_FAILED: "submit_assignment_failed",

			GET_SUBMISSIONS_SUCCESSFUL: "get_submissions_successful",
			GET_SUBMISSIONS_FAILED: "get_submissions_failed",

			SUBMIT_REVIEW_SUCCESSFUL:"submit_review_successful",
			SUBMIT_REVIEW_FAILED:"submit_review_failed",

			PUSH_STANDARD_SUCCESSFUL:"push_standard_successful",
			PUSH_STANDARD_FAILED:"push_standard_failed",

			GET_STANDARD_SUCCESSFUL:"get_standard_successful",
			GET_STANDARD_FAILED:"get_standard_failed",

            SAVE_LOGS_SUCCESSFUL:"save_logs_successful",
			SAVE_LOGS_FAILED:"save_logs_failed",

 			TEACHER_CREATE_CHALLENGE_SUCCESSFUL:"teacher_create_challenge_successful",
			TEACHER_CREATE_CHALLENGE_FAILED:"teacher_create_challenge_failed",

			GET_CHALLENGE_SUCCESSFUL:"get_challenge_successful",
			GET_CHALLENGE_FAILED:"get_challenge_failed",

			GET_CHALLENGE_CHAIN_SUCCESSFUL:"get_challenge_chain_successful",

			UPLOAD_CHALLENGE_RESULTS_SUCCESSFUL: "upload_challenge_results_successful",

			GET_STUDENTS_SUCCESSFUL: "get_students_successful",
			INVERT_SYSTEMS_SUCCESSFUL: "invert_systems_successful",
			ENABLE_SYSTEM_SWITCH_SUCCESSFUL: "enable_system_switch_successful",

			KICK_FROM_WEBSITE: "kick_from_website",
			UPDATE_STANDARDS_CONFIG_SUCCESSFUL: "update_standards_configurations_successful",
			UPDATE_STANDARDS_CONFIG_FAILED: "update_standards_configurations_failed",

            STUDENT_DATA_PROCESSED: "student_data_processed",

            CHANGE_PASSWORD_SUCCESSFUL: "change_password_successful",
            CHANGE_PASSWORD_FAILED: "change_password_failed",

            GO_TO_GOOGLE_SHEET_SUCCESSFUL: "go_to_google_sheet_successful",
            GO_TO_GOOGLE_SHEET_FAILED: "go_to_google_sheet_failed",

		};
	}

	handleMessage (message)
	{
		var msg = JSON.parse(message);
		var type = msg.type;
		var data = msg.data;

        app.standards.update(data, type);
		app.assignments.update(data, type);
		app.submissions.update(data, type);
		app.challenge.update(data, type);
		app.annalist.trackServerMessages(data, type);
        app.user.update(data, type);
        app.students.update(data, type);

        if (this.types.KICK_FROM_WEBSITE === type)
        {
        	document.location.reload();
		}

		if (this.types.STUDENT_DATA_PROCESSED === type)
		{
		    var name = data.name;
		    var file = data.file;

		    var element = document.createElement('a');
		    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(file));
		    element.setAttribute('download', name);

		    element.style.display = 'none';
		    document.body.appendChild(element);

		    element.click();

		    document.body.removeChild(element);
        }

        if("request_token" === type) {
            var token = window.localStorage.getItem("nfdawjwawuemupcawuiehcpmuwehmcpuwauehpowdc");
            app.net.sendMessage("analyze_token", {token:token});
        }

        if ("no_token" === type){
            document.getElementsByClassName("signin-box")[0].style.display = "block";
        }
	}
}
