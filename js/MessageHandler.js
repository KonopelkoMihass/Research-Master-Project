/**Handles messages**/
class MessageHandler
{
	constructor  ()
	{
		this.types = {
			SIGN_IN_SUCCESSFUL: "signin_successful",
			SIGN_IN_FAILED: "signin_failed",

			SIGN_UP_SUCCESSFUL: "signup_successful",
			SIGN_UP_FAILED: "signup_failed"
		};
	}

	handleMessage (message)
	{

		var msg = JSON.parse(message);
		var type = msg.type;
		var data = msg.data;

		console.log("Message received:", type,"-", data);

		if (type === this.types.SIGN_UP_SUCCESSFUL ||
			type === this.types.SIGN_IN_SUCCESSFUL ||
			type === this.types.SIGN_IN_FAILED ||
			type === this.types.SIGN_UP_FAILED)
		{
			app.user.update(data, type);
		}
	}
}
