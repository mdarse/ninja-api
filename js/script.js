var apiURL = '<API URL>'; // URL to call apisEtherpad

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
        allPadID = jQuery.parseJSON(jsonObject); // json object allPadID become an object

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
    function getTextOfThisPad(padID) {


    }

    getAllPadID();

    getTextOfThisPad();

}