class UIFactory
{
	constructor()
	{

	}

	createModal(modalIDPrefix, title, body, includeSubmitButton)
	{
		// Create all elements
		var modal = document.createElement("DIV");
		modal.className = "modal";
		modal.id = modalIDPrefix + "-modal";

		var modalSandbox = document.createElement("DIV");
		modalSandbox.className = "modal-sandbox";

		var modalBox = document.createElement("DIV");
		modalBox.className = "modal-box";

		var modalHeader = document.createElement("DIV");
		modalHeader.className = "modal-header";

		var modalClose = document.createElement("DIV");
		modalClose.className = "close-modal";
		modalClose.name = modalIDPrefix + "-close";
		modalClose.innerHTML = "&#10006;";

		var modalTitle = document.createElement("H1");
		var titleText = document.createTextNode(title);
    	modalTitle.appendChild(titleText);

		var modalBody = document.createElement("DIV");
		modalBody.className = "modal-body";
		modalBody.name = modalIDPrefix + "-modal-body";
		modalBody.innerHTML = body;


		var submitBtn = document.createElement("Button");
		submitBtn.className = "button-modal";
		submitBtn.name = modalIDPrefix + "-close";
		submitBtn.innerHTML = "Submit";


		var cancelBtn = document.createElement("Button");
		cancelBtn.className = "button-modal";
		cancelBtn.name = modalIDPrefix + "-close";
		cancelBtn.innerHTML = "Close";


		//Assemble all
		modal.appendChild(modalSandbox);
		modal.appendChild(modalBox);
		modalBox.appendChild(modalHeader);
		modalHeader.appendChild(modalClose);
		modalHeader.appendChild(modalTitle);
		modalBox.appendChild(modalBody);

		if (includeSubmitButton)
		{
			modalBox.appendChild(submitBtn);
		}

		modalBox.appendChild(cancelBtn);


		var elementDict = {};
		elementDict.modal = modal;
		elementDict.submit = submitBtn;

		var closeButtons = [cancelBtn, modalClose];


        for (var i = 0; i <closeButtons.length;i++){
			closeButtons[i].addEventListener("click", function ()
			{
				var parentNode = modal.parentNode;
				parentNode.removeChild(modal);
			});
        }

        elementDict.closes = closeButtons;


		return elementDict;
	}


	insertTooltip(elementToInsertInto, tooltip)
	{
		elementToInsertInto.className += " tooltip";

		var tooltipSpan = document.createElement("SPAN");
		tooltipSpan.className = "tooltiptext";
		tooltipSpan.innerHTML = tooltip;

		elementToInsertInto.appendChild(tooltipSpan);
	}
}
