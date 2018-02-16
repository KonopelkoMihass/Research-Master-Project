/**For speeding up creating UI elements (This is the module pattern)**/
var uiFactory = (function UIFactory()
{
	var module={};

	module.createRadioElement = function (id, labelid, name, checked, text)
	{
		var label = '<label id = '+labelid+' for = ' + id + '>' + text + '</label> <br>';
		var radioHtml = '<input type = "radio" id = "' + id + '" name="' + name + '"';

		if (checked)
		{
			radioHtml += ' checked = "checked"';
		}

		radioHtml += '/>';
	  radioHtml += label;

		return radioHtml;
	}

	/**create a textbox**/
	module.createTextBox = function(id, text)
	{
		var textBox = "";

		textBox += '<label id = "' + id + ' lablel">' + text + '</label>'
		textBox += '<input type = "textbox" id = "' + id + '" placeholder = "' + text + '"/>'

		return textBox;
	}

	/**this method creates a password text box**/
	module.createPasswordBox = function(id, text)
	{
		var textBox = "";

		textBox += '<label id = "' + id + ' lablel">' + text + '</label>'
		textBox += '<input type = "password" id = "' + id + '" placeholder = "' + text + '"/>'
		return textBox;
	}

	return module;
}());
