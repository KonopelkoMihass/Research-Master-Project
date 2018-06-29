// There will be stored all review data
var reviewData = [];



function main()
{

    document.getElementById("generate-review-json").addEventListener("click", function () {
    parseReviewIntoJSON();
    });


    //Assume we got our code in a form of a string.
    //Strange thing - when cpp file containing quotes is parsed - somehow  the quotes do not conflict with the string integrity.
    //I suspect it is due to some Regex code.  In the example of this code, I added \n and \"

    var code =
        "#include <iostream> \n" +
        "const float pi = 3.14159265358979f;\n" +
        "using namespace std;\n" +
        "int main()\n" +
        "{ " +
        "   // pi * 2R\n" +
        "   int cirumfarance = 2*pi * 3;\n" +
        "   cout<<\"Circumfarance is \"<< cirumfarance;\n" +
        "   return 0;\n" +
        "}";


    // Returns a highlighted HTML string
    var parsedHTML = Prism.highlight(code, Prism.languages.cpp);


    // Now we insert it into a <code> area
    var codeArea = document.getElementById("code-review");
    codeArea.innerHTML = parsedHTML;

    // Needed to restore line numbers
    Prism.highlightAllUnder(document.getElementById("precode-area"));


    // This part makes line numbers pressable.  I needed to modify the source code to allow it.  PRISMjs is under
    // MIT Licence.
    var lineNumSpans = document.getElementsByName("lineNumSpan");
    for (var i = 0; i < lineNumSpans.length; i++ )
    {
        var codeElement = lineNumSpans[i];
        codeElement.addEventListener("click", function ()
        {
            var lineNum = this.id;

               //Check if it is already has a class "selected"
            if ( !this.classList.contains("selected"))
            {
                this.className += " selected";
                console.log ("Selected Line: " +  this.id);

                // Add it to a window on the right
                addLineBit(this.id);
            }

            else
            {
                this.classList.remove("selected");
                console.log ("Deselected Line: " , this.id );
                deleteLineBit(this.id);
            }
        });
    }


    var tokens = document.getElementById("code-review").childNodes;
    for (var i = 0; i < tokens.length; i++ )
    {
        var token = tokens[i];

        // Line number span is also in there.  So to not affect it - we will check for a specific class name and skip it.
        if (token.className === "line-numbers-rows")
        {
            continue;
        }


        // PrismJS puts unidentifiable things as pure text.  These text are often the variables,
        // so I decided to turn them into span here.

        if (token.nodeName === "#text")
        {
            var content = token.textContent;
            content = content.replace(/\s/g, '');

            if (content !== ""){
                console.log (content);
                var span = document.createElement("SPAN");
                span.className = "token";
                span.innerText = " " + content + " ";

                document.getElementById("code-review").replaceChild(span, token);
                token = span;
            }
        }

        // Then I add id for each span and a click event.
        token.id = "reviewTokenID#" + i ;
        token.addEventListener("click", function()
        {
            var wordNum = this.id.split("#")[1];

            //Check if it is already has a class "selected"
            if ( !this.classList.contains("selected"))
            {
                this.className += " selected";

                var content = this.textContent;
                console.log ("Selected Word: " + content );

                // Add it to a window on the right
                addCodeBit(this.id, content );

            }

            else
            {
                this.classList.remove("selected");

                var content = this.textContent;
                console.log ("Deselected Word: " + content );
                deleteCodeBit(this.id);
            }

        });

    }
}



function addCodeBit(id, content)
{
    // Save it to review (for now.  Can be done after the review)
    var codeBit = {};
    codeBit.id = id;
    codeBit.content = content;
    codeBit.type = "token";
    codeBit.review = "TEST";

    reviewData.push(codeBit);

    var reviewTable = document.getElementById("review-data-table");
    var row = reviewTable.insertRow(-1);

    row.id = id + "-row";
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    cell0.innerHTML = content;
    cell1.innerHTML = "There we can have review stuff needed";
}



function deleteCodeBit(id)
{

    var rowToDelete = document.getElementById(id + "-row");
    rowToDelete.parentNode.removeChild(rowToDelete);
}


function addLineBit(id)
{
    // Save it to review (for now.  Can be done after the review)
    var codeBit = {};
    codeBit.id = id;
    codeBit.type = "line";
    codeBit.review = "TEST";
    reviewData.push(codeBit);


    var reviewTable = document.getElementById("review-data-table");
    var row = reviewTable.insertRow(-1);

    row.id = id + "-row";
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    cell0.innerHTML = "Whole line " + id;
    cell1.innerHTML = "There we can have review stuff needed";
}


function deleteLineBit(id)
{
    var rowToDelete = document.getElementById(id + "-row");
    rowToDelete.parentNode.removeChild(rowToDelete);
}


function parseReviewIntoJSON()
{
    var m = JSON.stringify(reviewData);
    console.log(m);
}





















