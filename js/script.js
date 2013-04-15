var apiURL = '<API URL>'; // URL to call apisEtherpad
var listHTMLTransformationChoice = {
    bin: '<li id="bin"><p>binary</p><p class="ex">01100010 01101001 01101110</p></li>',
    hexa: '<li id="hexa"><p>hexadecimal</p><p class="ex">68657861</p></li>',
    base36: '<li id="base36"><p>base36</p><p class="ex">12CCXEDCMU</p></li>',
    hangman: '<li id="hangman"><p>hangman</p><p class="ex">h _ _ _ _ _ n</p></li>',
    vowel: '<li id="vowel"><p>vowelless</p><p class="ex">vwllss</p></li>'
};


    /**
    * GET JSON DATA IN AJAX
    *
    * @param string path
    * @return jsonObject results
    */
    function getJsonDataInAjax(path) {

        $.ajax({
            url: apiURL+path,
            dataType: 'json',
            error: function(error){
                console.log('Error when connected to the API : ');
                console.log(error);
            },
            success: function(results){
                return results;
            }
        });
    }


    /**
    * GET ALL PAD ID
    *
    */
    function getAllPadID() {
        var data = getJsonDataInAjax('/texts'), // get all pad ID
            allPadID = JSON.parse(data).data || [],
            html;

        allPadID.forEach(function(padID) {
            html += "<option value='"+padID+"'>"+padID+"</option>";
        });
        $("#pad form select").html(html);
    }


    /**
    * GET TEXT OF THIS PAD
    *
    * @param int padID
    */
    function getTextOfThisPad() {
        var data = getJsonDataInAjax('/texts/'+selectedPadID); // get all pad ID
            text = JSON.parse(data).data || [];

        if(text){
            $("#padText p").html(text);
        }

    }


    /**
    * GET ALL TRANSFORMATION TYPE
    *
    */
    function getAllTransformationType(){
        var data = getJsonDataInAjax('/texts/'+selectedPadID+'/transform'); // get all transformation
            allTransformationType = JSON.parse(data).data || [],
            html;

        allTransformationType.forEach(function(TransformationType) {
            if(document.listHTMLTransformationChoice[TransformationType]){
                html += listHTMLTransformationChoice[TransformationType];
            }
        });
        $("#transformation ul").html(html);
    }


    /**
    * MAKE TRANSFORMATION
    * 
    * @param object event
    */
    function makeTransformation(event) {
        var data = getJsonDataInAjax('/texts/'+selectedPadID+'/transform/'+this.id); // get transformation result
            transformationResult = JSON.parse(data).data || [],

        $("#resultText p").html(transformationResult);

    }

// When DOM is loading...
$(document).ready(function(){
    
    getAllPadID();

    $("#pad option").on('change', function(e){

        selectedPadID = $('#pad option:selected').val();
        getTextOfThisPad();

        getAllTransformationType();

        $("#transformation ul li").addEventListener("click", makeTransformation, false);

    });

});