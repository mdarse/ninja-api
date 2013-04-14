var apiURL = '<API URL>'; // URL to call apisEtherpad
var listHTMLTransformationChoice = { "bin" : "<li id="bin"><p>binary</p><p class="ex">01100010 01101001 01101110</p></li>",
                                     "hexa" : "<li id="hexa"><p>hexadecimal</p><p class="ex">68657861</p></li>",
                                     "base36": "<li id="base36"><p>base36</p><p class="ex">12CCXEDCMU</p></li>",
                                     "hangman": "<li id="hangman"><p>hangman</p><p class="ex">h _ _ _ _ _ n</p></li>",
                                     "vowel": "<li id="vowel"><p>vowelless</p><p class="ex">vwllss</p></li>"
                                   };

// When DOM is loading...
$(document).ready(function(){

    /**
    * GET JSON DATA IN AJAX
    *
    * @param string path
    * @return jsonObject results
    */
    function getJsonDataInAjax(path) {

        Jquery.ajax({
            url: document.apiURL+path,
            dataType: 'json',
            error: function(error){
                console.log('Error when connected to the API : ');
                console.log(error);
            },
            success: function(results){
                return results;
            },
        });

    }


    /**
    * GET ALL PAD ID
    *
    */
    function getAllPadID() {
        var allPadID = getJsonDataInAjax('/texts'); // get all pad ID
        allPadID = jQuery.parseJSON(allPadID); // json object allPadID become an object

        if(allPadID.data){
            for each(padID in allPadID.data) {
                $("#pad form select").innerHTML("<option value='"+padID+"'>"+padID+"</option>");
            }
        }
    }


    /**
    * GET TEXT OF THIS PAD
    *
    * @param int padID
    */
    function getTextOfThisPad() {
        var text = getJsonDataInAjax('/texts/'+selectedPadID); // get all pad ID
        text = jQuery.parseJSON(text); // json object allPadID become an object

        if(text.data){
            $("#padText p").innerHTML(text.data);
        }

    }


    /**
    * GET ALL TRANSFORMATION TYPE
    *
    */
    function getAllTransformationType(){
        var allTransformationType = getJsonDataInAjax('/texts/'+selectedPadID+'/transform'); // get all transformation
        allTransformationType = jQuery.parseJSON(allTransformationType); // json object allTransformationType become an object

        if(allTransformationType.data){
            for each(TransformationType in allTransformationType.data) {
                if(document.listHTMLTransformationChoice[TransformationType]){
                    $("#transformation ul").innerHTML(document.listHTMLTransformationChoice[TransformationType]);
                }
            }
        }

    }


    function makeTransformation(event) {
        var transformationResult = getJsonDataInAjax('/texts/'+selectedPadID+'/transform/'+this.id); // get transformation result
        transformationResult = jQuery.parseJSON(transformationResult); // json object transformationResult become an object

        if(transformationResult.data){
            $("#resultText p").innerHTML(transformationResult.data);
        }

    }


    getAllPadID();

    selectedPadID = $('#pad option:selected').val();
    getTextOfThisPad();

    getAllTransformationType();

    $("#transformation ul li").addEventListener("click", makeTransformation, false);

}