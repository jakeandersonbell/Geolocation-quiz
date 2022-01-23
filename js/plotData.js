// This fie handles the adding of question data to the map

// Initialise global variables including markers
let quizData;
let weekData;
let nearData;
let missData;
let lastData;
let shuffled;
let quizPoint;
let markers = {};
let testMarkerBlue = L.AwesomeMarkers.icon({
    icon: 'play',
    markerColor: 'blue'}
);
let testMarkerOrange = L.AwesomeMarkers.icon({
    icon: 'play',
    markerColor: 'orange'}
);
let testMarkerRed = L.AwesomeMarkers.icon({
        icon: 'play',
        markerColor: 'red'
    }
);
let testMarkerGreen = L.AwesomeMarkers.icon({
        icon: 'play',
        markerColor: 'green'
    }
);


// This function gets the users questions and only displays the title and the question id in the popup
// for setting component
function getQuizData(myMap) {
    // If the layer already exists remove it so it can be updated
    if (myMap.hasLayer(quizData)) {
        myMap.removeLayer(quizData);
    }
    // The get URL
    var layerURL = "https://developer.cege.ucl.ac.uk:30260/getQuizQuestions/" + httpsPortNumberAPI;
    $.ajax({
        url: layerURL, crossDomain: true, success: function (result) {
            quizData = L.geoJSON(result, {
                // Add each point to the layer
                pointToLayer: function (feature, latlng) {
                    // Add the popup content html to bindpopup
                    return L.marker(latlng,
                        {icon:testMarkerOrange}).bindPopup("<b>"+feature.properties.question_title +
                        "</b><br/>Question ID: " +  feature.properties.id);
                }
            });
            // Add the complete layer
            quizData.addTo(myMap);
        }
    })
}

// This function gets the users questions and displays all parts relevant to the quiz component
function doQuiz(myMap) {
    var layerURL = "https://developer.cege.ucl.ac.uk:30260/getQuizQuestions/" + httpsPortNumberAPI;
    $.ajax({
        url: layerURL, crossDomain: true, success: function (result) {
            // Store the result in a variable
            quizData = L.geoJSON(result, {
                pointToLayer: function (feature, latlng) {
                    // An array of ordered answers to be stored in a hidden element
                    let answers = [feature.properties.answer_1, feature.properties.answer_2,
                        feature.properties.answer_3, feature.properties.answer_4];
                    // Shuffle the answers each time the questions are loaded
                    let latlong = feature.properties.coordinates;
                    // console.log(latlong);
                    shuffled = shuffle(answers);
                    console.log(feature.properties.correct_answer);
                    // The html content to be stored in each point
                    let content = "<b><u>"+feature.properties.question_title +
                        "</u></b><br/><div hidden name=\"question_id\" id=\"question_id\">" + feature.properties.id +
                        "</div><br/><b>" +  feature.properties.question_text + "</b><br/>" +
                        "<select name=\"answerselectbox\" id=\"answerselectbox\"><option >" + shuffled[0] + "</option>" +
                        "<option>" + shuffled[1] + "</option><option>" + shuffled[2] + "</option>" +
                        "<option>" + shuffled[3] + "</option></select>" +
                        "<button id=\"uploadAnswers\" onclick=\"startAnswerUpload(" + latlong + ")\">Submit answer</button>" +
                        "<div id=\"answers\" hidden>" + [feature.properties.answer_1, feature.properties.answer_2,
                            feature.properties.answer_3, feature.properties.answer_4] + "</div>" +
                        "<div hidden id=\"correct\">" + feature.properties.correct_answer + "</div>";

                    // Store complete marker in a variable, make the popup width dependent on screen width
                    // Orange is default marker colour
                    quizPoint = L.marker(latlng,
                        {icon:testMarkerOrange}).bindPopup(content, {
                        maxWidth: $(window).width() / 2.5
                    });
                    // Add the complete marker to an array to be accessed later
                    markers[feature.properties.id] = quizPoint;

                    return quizPoint;
                }
            });
            // Add the complete layer
            quizData.addTo(myMap);
        }
    })
}

function getWeeksData(myMap) {
    // Function is the same as getQuizData() apart from getting data from different URL
    // Gets questions added in past week
    // Only run if layer does not exist
    if (myMap.hasLayer(weekData)) {
        return;
    }
    console.log("has not layer");
    var layerURL = "https://developer.cege.ucl.ac.uk:30260/weekQuestions/";
    $.ajax({
        url: layerURL, crossDomain: true, success: function (result) {
            // Store result
            weekData = L.geoJSON(result, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng,
                        {icon: testMarkerRed}).bindPopup("<b>" + feature.properties.question_title +
                        "</b><br/>Question ID" + feature.properties.id);
                }
            });
            // Add layer to map
            weekData.addTo(myMap);
        }
    })
}

function getNearData(myMap) {
    if (!myMap.hasLayer(nearData)) {
        console.log("has not layer");
        // Layer URL dependent on user location
        var layerURL = "https://developer.cege.ucl.ac.uk:30260/nearQuestions/" + userPos.getLatLng()['lng'] + "/" +
            userPos.getLatLng()['lat'];
        $.ajax({
            url: layerURL, crossDomain: true, success: function (result) {
                // Store result
                nearData = L.geoJSON(result, {
                    pointToLayer: function (feature, latlng) {

                        return L.marker(latlng,
                            {icon:testMarkerBlue}).bindPopup("<b>"+feature.properties.question_title +
                            "</b><br/>Question ID" +  feature.properties.id);
                    }
                });
                // Add layer to map
                nearData.addTo(myMap);
            }
        })
    }
}

function getLastData(myMap) {
    var layerURL = "https://developer.cege.ucl.ac.uk:30260/lastAnswered/" + httpsPortNumberAPI;
    $.ajax({
        url: layerURL, crossDomain: true, success: function (result) {
            lastData = L.geoJSON(result, {
                pointToLayer: function (feature, latlng) {
                    // an array of ordered answers to be stored in a hidden element
                    let answers = [feature.properties.answer_1, feature.properties.answer_2,
                        feature.properties.answer_3, feature.properties.answer_4];
                    // Shuffle the answers each time the questions are loaded
                    let latlong = feature.properties.coordinates;
                    // Shuffle ordered answers
                    shuffled = shuffle(answers);
                    // questionsDict[feature.properties.id] = [0];
                    let content = "<b><u>"+feature.properties.question_title +
                        "</u></b><br/><div hidden name=\"question_id\" id=\"question_id\">" + feature.properties.id +
                        "</div><br/><b>" +  feature.properties.question_text + "</b><br/>" +
                        "<select name=\"answerselectbox\" id=\"answerselectbox\"><option >" + shuffled[0] + "</option>" +
                        "<option>" + shuffled[1] + "</option><option>" + shuffled[2] + "</option>" +
                        "<option>" + shuffled[3] + "</option></select>" +
                        "<button id=\"uploadAnswers\" onclick=\"startAnswerUpload(" + latlong + ")\">Submit answer</button>" +
                        "<div id=\"answers\" hidden>" + [feature.properties.answer_1, feature.properties.answer_2,
                            feature.properties.answer_3, feature.properties.answer_4] + "</div>" +
                        "<div hidden id=\"correct\">0</div>";

                    if(feature.properties.answer_correct){
                        quizPoint = L.marker(latlng,
                            {icon:testMarkerGreen}).bindPopup(content, {
                            maxWidth: $(window).width() / 2.5
                        });
                    }else{
                        quizPoint = L.marker(latlng,
                            {icon:testMarkerRed}).bindPopup(content, {
                            maxWidth: $(window).width() / 3
                        });
                    }
                    // Add to array of all questions
                    markers[feature.properties.id] = quizPoint;
                    return quizPoint;
                }
            });
            // Add layer
            lastData.addTo(myMap);
        }
    })
}

function getMissedData(myMap) {
    // Display questions that the user got incorrect or ha not answered
    var layerURL = "https://developer.cege.ucl.ac.uk:30260/notAnswered/" + httpsPortNumberAPI;
    $.ajax({
        url: layerURL, crossDomain: true, success: function (result) {
            missData = L.geoJSON(result, {
                pointToLayer: function (feature, latlng) {
                    // an array of ordered answers to be stored in a hidden element
                    let answers = [feature.properties.answer_1, feature.properties.answer_2,
                        feature.properties.answer_3, feature.properties.answer_4];
                    // Shuffle the answers each time the questions are loaded
                    let latlong = feature.properties.coordinates;
                    // console.log(latlong);
                    shuffled = shuffle(answers);

                    // questionsDict[feature.properties.id] = [0];
                    let content = "<b><u>"+feature.properties.question_title +
                        "</u></b><br/><div hidden name=\"question_id\" id=\"question_id\">" + feature.properties.id +
                        "</div><br/><b>" +  feature.properties.question_text + "</b><br/>" +
                        "<select name=\"answerselectbox\" id=\"answerselectbox\"><option >" + shuffled[0] + "</option>" +
                        "<option>" + shuffled[1] + "</option><option>" + shuffled[2] + "</option>" +
                        "<option>" + shuffled[3] + "</option></select>" +
                        "<button id=\"uploadAnswers\" onclick=\"startAnswerUpload(" + latlong + ")\">Submit answer</button>" +
                        "<div id=\"answers\" hidden>" + [feature.properties.answer_1, feature.properties.answer_2,
                            feature.properties.answer_3, feature.properties.answer_4] + "</div>" +
                        "<div hidden id=\"correct\">0</div>";

                    quizPoint = L.marker(latlng,
                        {icon:testMarkerOrange}).bindPopup(content, {
                        maxWidth: $(window).width() / 2.5
                    });
                    markers[feature.properties.id] = quizPoint;

                    return quizPoint;
                }
            });
            missData.addTo(myMap);
        }
    })
}