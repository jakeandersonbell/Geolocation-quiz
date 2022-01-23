var colnames = "id, question_title, question_text, answer_1,";
colnames = colnames + "answer_2, answer_3, answer_4, port_id, correct_answer";
console.log("colnames are " + colnames);

let questionData;

function getQuestionData() {
    if (!myMap.hasLayer(questionData)) {
        var serviceUrl = "https://developer.cege.ucl.ac.uk:30260/getGeoJSON/london_poi/geom";
        ajax({
            url: serviceUrl,
            crossDomain: true,
            type: "GET",
            success: function(data){console.log(data);},
        });
    }

}