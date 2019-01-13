

class Utilities
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
			submitBtn.addEventListener("click", function(){app.tracker.trackModalDestruction(title)});
		}

		modalBox.appendChild(cancelBtn);

		var elementDict = {};
		elementDict.modal = modal;
		elementDict.submit = submitBtn;

		var closeButtons = [cancelBtn, modalClose];

        for (var i = 0; i <closeButtons.length;i++){
			closeButtons[i].addEventListener("click", function ()
			{
				app.tracker.trackModalDestruction(title);
				var parentNode = modal.parentNode;
				parentNode.removeChild(modal);
			});
        }
        elementDict.closes = closeButtons;
        document.body.appendChild(modal);

		app.tracker.trackModalCreation(title);
		app.tracker.updateTracks();

		return elementDict;
	}

	insertTooltip(elementToInsertInto, tooltip)
	{
		elementToInsertInto.className += " tooltip";

		var tooltipSpan = document.createElement("SPAN");
		tooltipSpan.innerHTML = tooltip;
		tooltipSpan.className = "tooltiptext";
		tooltipSpan.style.visibility = "hidden";
		tooltipSpan.style.opacity= "0";


		elementToInsertInto.appendChild(tooltipSpan);
	}

	assignFuncToButtonViaID(elementID, func)
	{
        var elem = document.getElementById(elementID);
        elem.addEventListener("click", func);
    }

    derivePrismLanguage(language)
	{
		if (language === "cpp") {
			return Prism.languages.cpp;
		}
		else if (language === "js") {
			return Prism.languages.javascript;
		}
		else if (language === "css") {
			return Prism.languages.css;
		}
		else if (language === "html") {
			return Prism.languages.markup;
		}
	}

	readableDate(dateStr)
	{
		var date = new Date(dateStr);
		return date.toDateString();
	}

	getRandomInt(max)
	{
		  return Math.floor(Math.random() * Math.floor(max));
	}



    generateSkillProgressBar(parentDiv, category, i, maxScore, currentScore )
    {

        var divId = "profile-" + category.replace(/\s/g, '') + "-" + i + "-progBar";
        var div = document.createElement("SPAN");
        div.id = divId;
        //div.style.cssFloat="right";
        div.style.right = "225px";
        div.style.position = "absolute";
        parentDiv.appendChild(div);


        // based on this tutorial: http://mbostock.github.com/d3/tutorial/bar-1.html
        // with adjustments and stuff
        // see it here: http://jsbin.com/avemek/2/

        var data = [maxScore, currentScore]; // here are the data values; v1 = total, v2 = current value

        var idToFind = "#"+divId;
        var chart = d3.select(idToFind).append("svg") // creating the svg object inside the container div
        .attr("class", "chart")
        .attr("width", 250) // bar has a fixed width
        .attr("height", 20 * data.length);

        var x = d3.scaleLinear() // takes the fixed width and creates the percentage from the data values
        .domain([0, d3.max(data)])
        .range([0, 250]);

        chart.selectAll("rect") // this is what actually creates the bars
        .data(data)
        .enter().append("rect")
        .attr("width", x)
        .attr("height", 20)
        .attr("rx", 3) // rounded corners
        .attr("ry", 3);

        chart.selectAll("text") // adding the text labels to the bar
        .data(data)
        .enter().append("text")
        .attr("x", x)
        .attr("y", 10) // y position of the text inside bar
        .attr("dx", -3) // padding-right
        .attr("dy", ".35em") // vertical-align: middle
        .attr("text-anchor", "end") // text-align: right
        .text(String);
    }


    addChallengeProgressBar(challengeNum)
    {
        var svg = d3.select('#challenge-chain-done-progress')
            .append('svg')
            .attr('height', 30)
            .attr('width', 320);


        var states = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            segmentWidth = 32,
            currentState = 'none';


        var colorScale = d3.scaleOrdinal()
            .domain(states)
            .range(["#5e636b", "red", "red", "red", 'orange', 'orange','yellow', 'yellow', 'green', 'green', "#00CED1" ]);

        svg.append('rect')
            .attr('class', 'bg-rect')
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('fill', 'gray')
            .attr('height', 15)
            .attr('width', function(){
                return segmentWidth * (states.length-1);
            })
            .attr('x', 0);

        var progBarId = "challenge-progress-bar-" + challengeNum;

        var progress = svg.append('rect')
                        .attr('class', 'progress-rect')
                        .attr('id', progBarId)
                        .attr('fill', function(){
                            return colorScale(currentState);
                        })
                        .attr('height', 15)
                        .attr('width', 0)
                        .attr('rx', 10)
                        .attr('ry', 10)
                        .attr('x', 0);

        progress.transition()
            .duration(1000)
            .attr('width', function(){
                var index = states.indexOf(currentState);
                return (index + 1) * segmentWidth;
            });

        this.fillTheChallengeBar("0", challengeNum);

    }

    fillTheChallengeBar(state, num)
    {
        var id = "#challenge-progress-bar-"+num;

        var states = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            segmentWidth = 32;

        var colorScale = d3.scaleOrdinal()
            .domain(states)
            .range(["#5e636b", "red", "red", "red", 'orange', 'orange','yellow', 'yellow', 'green', 'green', "#00CED1" ]);



        var svg = d3.select('#challenge-chain-done-progress');
        svg.selectAll(id).transition()
                .duration(1000)
                .attr('fill', function(){
                    return colorScale(state);
                })
                .attr('width', function(){
                    var index = states.indexOf(state);
                    return (index ) * segmentWidth;
                });
    }
}




















