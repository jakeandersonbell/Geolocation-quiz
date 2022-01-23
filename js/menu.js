// This file holds most of the functionality concerned with
// loading of the page and displaying page content

let width;
let height;
// rem is a unit of width parameter used by bootstrap
let rem = 16;
let sidebar;
let space;

// Create a bar graph of top five player scores
let topFiveGraph = function () {
    // Bar chart adapted from https://observablehq.com/@d3/lets-make-a-bar-chart
    // variable to hold the html is initiated with a header
    let html = "<h4>Highest ranked users</h4><div class=\"chart\">";
    // The total space for the content is calculated in basicMap.js when the map is loaded
    // Set a value that will be used to multiply the bar widths to fill the available space
    // This is obtained by looking at the highest value in proportion to the available space
    // Multiply by 0.9 so there is some buffer
    let mult = Math.round((space / Math.max.apply(Math, scores)) * 0.9);
    // loop through the user scores and iteratively append them to html as bars to the graph
    for (let i = 0; i < scores.length; i++) {
        html += "<div style=\"width: " + scores[i] * mult + "px;\">" + rank_ids[i] + ": " + scores[i] + "</div>"
    }
    // Close off the element and send it to the correct parent element
    html += "</div>";
    document.getElementById("top chart").innerHTML = html;
};

let myPartGraph = function () {
    // Bar chart adapted from https://observablehq.com/@d3/lets-make-a-bar-chart
    // See comments in topFiveGraph() from line 7 for explanation
    let html = "<h4>Your daily participation</h4><div class=\"chart\">";
    // Multiply by 0.5 to make comparison easier
    let mult = Math.round((space / Math.max.apply(Math, myPartAns)) * 0.5);
    for (let i = 0; i < myPartAns.length; i++) {
        html += "<div style=\"width: " + myPartAns[i] * mult + "px;\">" + myPartDay[i] + "</div>"
    }
    html += "</div>";
    document.getElementById("my part chart").innerHTML = html;
};

let partGraph = function () {
    // Bar chart adapted from https://observablehq.com/@d3/lets-make-a-bar-chart
    // See comments in topFiveGraph() from line 7 for explanation
    let html = "<h4>All user daily participation</h4><div class=\"chart\">";
    // Multiply by 0.5 to make comparison easier
    let mult = Math.round((space / Math.max.apply(Math, partAns)) * 0.5);
    for (let i = 0; i < partAns.length; i++) {
        html += "<div style=\"width: " + partAns[i] * mult + "px;\">" + partDay[i] + "</div>"
    }
    html += "</div>";
    document.getElementById("part chart").innerHTML = html;
};

let showHard{
    // Loop through array of hardest questions as html list elements, parsing to an output string to be sent to element
    // as inner HTML
    let html = "<h4>Most difficult questions</h4><ul>";
    for (i = 0; i < hards.length; i++) {
        html += "<li>" + hards[i] + "</li>"
    }
    html += "</ul>";
    document.getElementById("hard list").innerHTML = html;
};

let loadTop = function () {
    // Create a chart div and call the topFiveGraph() function
    document.getElementById("small-screen-wrapper").innerHTML =
        "<div id='top chart'></div>";
    topFiveGraph();
};est = function ()

let loadRank = function() {
    document.getElementById("small-screen-wrapper").innerHTML =
        "Your rank is: " + userRank;
};

let loadHard = function () {
    document.getElementById("large-screen-wrapper").innerHTML =
        "</div><div id='hard list'></div>";
    showHardest();
};

let loadParticipation = function () {
    document.getElementById("large-screen-wrapper").innerHTML =
        "<br/><div id='my part chart'></div><div id='part chart'>";
    myPartGraph();
    partGraph();
};

let initialPageLoad = function () {
    // This function gets some important aspects of the page, tests conditions and loads the page content
    // Store dimensions as variables so we aren't required to keep calling the function
    width = $(window).width();
    height = $(window).height();
    console.log("Screen width: " + width + "px");
    // Sidebar width is dependent on screen width
    if($(window).width() < 770){
        sidebar = 6.5 * rem;
    }else{
        sidebar = 14 * rem;
    }
    // Get the available space
    space = width - sidebar;
    // Depending on the screen size load one of the app components: Quiz/Questions
    // Load in the relevant functionality
    // NOTE: The developer understands that bootstrap can be used to show/hide elements at different widths and it does
    // so
    // This approach alleviates the computational load by not having to load all content and only displaying half of it
    if (width < 992) {
        loadQuizPage();
        trackLocation();
        getRank();
        getCorrect();
        getTopFive();
    } else {
        loadSetPage();
        getMyParticipation();
        getParticipation();
        getHardest();
    }
};

let loadQuizPage = function (mode = "standard") {
    // Function to display the Quiz page content
    // Insert a div to hold the content - a single row
    document.getElementById("small-screen-wrapper").innerHTML =
        "<div class=\"col-sm-12\">\n" +
        "        <div class=\"row\">\n" +
        "        <div id=\"small page content\">\n" +
        "        <div id=\"quizmapid\"></div>\n" +
        "        </div>\n" +
        "        </div>\n" +
        "        </div>";

    // Load the map into the div and load the standard content
    loadQuizMap('quizmapid');
    doQuiz(quizMap);
    // Track user and display
    trackLocation();

    // Check nearby questions after 1 minute, let the user familiarise themselves with the setup
    checkProximity()
};

let loadSetPage = function (mode = "standard") {
    // Load question setting component as map and form
    // 2 Columns: 7 width for map; 5 width for form
    // Default input values prompt user
    document.getElementById("large-screen-wrapper").innerHTML =
        "<div class=\"row\">\n" +
        "            <div class=\"col-lg-7\">\n" +
        "              <div class=\"p-3\">\n" +
        "                  <div id=\"setmapid\"></div>\n" +
        "              </div>\n" +
        "            </div>\n" +
        "\n" +
        "            <!--     Form area     -->\n" +
        "            <div class=\"col-lg-5\">\n" +
        "              <div class=\"row\">\n" +
        "                <h5>Question title</h5>\n" +
        "              </div>\n" +
        "              <div class=\"row\">\n" +
        "                <p>Give your question a fun title</p>\n" +
        "              </div>\n" +
        "              <div class=\"row\">\n" +
        "                <div class=\"col-lg-5\">\n" +
        "                  <label for=\"question_title\">Title</label><input type=\"text\" maxlength=\"25\" size=\"25\" id=\"question_title\" value=\"Enter Question Title\"\n" +
        "                                                         onblur=\"if(this.value==''){\n" +
        "                                                                      this.value='Enter Question Title'; }\"\n" +
        "                                                         onfocus=\"if(this.value=='Enter Question Title'){\n" +
        "                                                                      this.value='';}\"/><br/>\n" +
        "                </div>\n" +
        "              </div>\n" +
        "              <br/>\n" +
        "\n" +
        "              <!--      location area      -->\n" +
        "              <div class=\"row\">\n" +
        "                <h5>Question location</h5>\n" +
        "                <p>Enter the question location by getting your current location, clicking on the map,\n" +
        "                  or by entering the coordinates manually</p>\n" +
        "              </div>\n" +
        "              <div class=\"row\">\n" +
        "                <div class=\"col-lg-3\">\n" +
        "                  <label for=\"latitude\">Latitude   </label><input type=\"number\" size=\"10\" id=\"latitude\"/><br/>\n" +
        "                </div>\n" +
        "                <div class=\"col-lg-3\">\n" +
        "                  <label for=\"longitude\">Longitude </label><input type=\"number\" size=\"10\" id=\"longitude\"/><br/>\n" +
        "                </div>\n" +
        "                <div class=\"col-lg-4\">\n" +
        "                  <button id=\"getLocation\" onclick=\"getLocation()\">Click me to get your location</button><br><br>\n" +
        "                </div>\n" +
        "              </div>\n" +
        "              <!--      Question area      -->\n" +
        "              <h5>Question text</h5>\n" +
        "              <p>Enter the question text to be displayed to the user</p>\n" +
        "              <textarea id=\"question_text\" rows=\"2\" cols=\"40\" maxlength=\"150\" onfocus=\"if(this.value==this.defaultValue)this.value='';\"\n" +
        "                        onblur=\"if(this.value=='')this.value=this.defaultValue;\">Type out the question here</textarea>\n" +
        "              <!--      Answers area      -->\n" +
        "              <h5>Question answers</h5>\n" +
        "              <p>Enter the correct answer to the question and three incorrect answers</p>\n" +
        "              <div class=\"row\">\n" +
        "                <div class=\"col-lg-5\">\n" +
        "                  <label for=\"correct\">Correct answer</label><input maxlength=\"100\" type=\"text\" size=\"20\" id=\"correct\"\n" +
        "                                                                    value=\"Enter Correct Answer\" onblur=\"if(this.value==''){\n" +
        "                                                                      this.value='Enter Correct Answer'; }\"\n" +
        "                                                                    onfocus=\"if(this.value=='Enter Correct Answer'){\n" +
        "                                                                      this.value='';}\"/><br/>\n" +
        "                  <br/>\n" +
        "                  <label for=\"incorrect2\">Incorrect answer 2</label><input maxlength=\"100\" type=\"text\" size=\"20\" id=\"incorrect2\"\n" +
        "                                                                    value=\"Enter Incorrect Answer 2\" onblur=\"if(this.value==''){\n" +
        "                                                                      this.value='Enter Incorrect Answer 2'; }\"\n" +
        "                                                                    onfocus=\"if(this.value=='Enter Incorrect Answer 2'){\n" +
        "                                                                      this.value='';}\"/><br/>\n" +
        "                </div>\n" +
        "\n" +
        "                <div class=\"col-lg-5\">\n" +
        "                  <label for=\"incorrect1\">Incorrect answer 1</label><input maxlength=\"100\" type=\"text\" size=\"20\" id=\"incorrect1\"\n" +
        "                                                                    value=\"Enter Incorrect Answer 1\" onblur=\"if(this.value==''){\n" +
        "                                                                      this.value='Enter Incorrect Answer 1'; }\"\n" +
        "                                                                    onfocus=\"if(this.value=='Enter Incorrect Answer 1'){\n" +
        "                                                                      this.value='';}\"/><br/>\n" +
        "                  <br/>\n" +
        "                  <label for=\"incorrect3\">Incorrect answer 3</label><input maxlength=\"100\" type=\"text\" size=\"20\" id=\"incorrect3\"\n" +
        "                                                                       value=\"Enter Incorrect Answer 3\" onblur=\"if(this.value==''){\n" +
        "                                                                      this.value='Enter Incorrect Answer 3'; }\"\n" +
        "                                                                       onfocus=\"if(this.value=='Enter Incorrect Answer 3'){\n" +
        "                                                                      this.value='';}\"/><br/>\n" +
        "                </div>\n" +
        "              </div>\n" +
        "              <br/>\n" +
        "\n" +
        "              <div class=\"row\">\n" +
        "                <div class=\"col-lg-5\">\n" +
        "                  <button id=\"submitQuestion\" onclick=\"startQuestionUpload()\">Submit Question</button><br><br>\n" +
        "                </div>\n" +
        "                <div class=\"col-lg-5\">\n" +
        "                  <label for=\"deleteID\">Delete ID</label><input type=\"text\" size=\"25\" id=\"deleteID\"/><br />\n" +
        "                  <button id=\"startDelete\" onclick=\"deleteQuestion()\">Delete Record</button>\n" +
        "                  <div id=\"dataDeleteResult\">The result of the deletion goes here</div>\n" +
        "                </div>\n" +
        "              </div>\n" +
        "\n" +
        "            </div>\n" +
        "\n" +
        "          </div>";
    // Load map
    loadSetMap('setmapid');
    // Load data
    getQuizData(setMap);
    // Get user location
    trackLocation();
};


// The following functions handle clicking events on the map layer checkboxes
// When a user toggles a checkbox the function is run and gets the element in question
// If the field is now checked the data is loaded, else the layer is removed
let checkAll = function () {
    let checkbox = document.getElementById("all chbx");
    if (checkbox.checked) {
        doQuiz(quizMap);
    } else {
        quizMap.removeLayer(quizData)
    }
};

let checkMissing = function () {
    let checkbox = document.getElementById("missed chbx");
    if (checkbox.checked) {
        getMissedData(quizMap);
    } else {
        quizMap.removeLayer(missData)
    }
};

let checkLast = function () {
    let checkbox = document.getElementById("last chbx");
    if (checkbox.checked) {
        getLastData(quizMap);
    } else {
        quizMap.removeLayer(lastData)
    }
};

let checkSet = function () {
    let checkbox = document.getElementById("set chbx");
    if (checkbox.checked) {
        getQuizData(setMap);
    } else {
        setMap.removeLayer(quizData)
    }
};

let checkWeek = function () {
    let checkbox = document.getElementById("week chbx");
    if (checkbox.checked) {
        getWeeksData(setMap);
    } else {
        setMap.removeLayer(weekData)
    }
};

let checkNear = function () {
    let checkbox = document.getElementById("near chbx");
    if (checkbox.checked) {
        getNearData(setMap);
    } else {
        setMap.removeLayer(nearData)
    }
};

// The following functions load help resources for the corresponding app components
let loadBigHelp = function () {
    document.getElementById("large-screen-wrapper").innerHTML =
        "<h3>Question setting help page</h3>" +
        "<h4>Welcome to the question setter</h4>" +
        "<p>This is the question setting component of the app, here you can add quesitons to appear on the map.</p>" +
        "<h4>To add a question</h4>" +
        "<p>To add a question simply fill out the required fields on the set questions page, ensuring to select the " +
        "correct location for the question by clicking the location, getting your current location or entering the " +
        "coordinates manually. Make sure to put the correct answer in the first answer box, then some incorrect " +
        "answers in the remaining answer fields. Don't worry about having missed fields, the app will check and " +
        "not allow you to make a submission. Click 'Submit Question' when you think you're done.</p>" +
        "<h4>What happens next?</h4>" +
        "<p>When you have submitted a question users will be able to access it on the quiz component of the app. Don't " +
        "worry about the correct answer coming first, the order is randomised each time.</p>" +
        "<h4>Deleting questions</h4>" +
        "<p>If you wish to delete a question click its marker on the map and enter the question id number into the Delete " +
        "ID field of the form before hitting 'Delete Record'.</p>" +
        "<h4>Using the question layers</h4>" +
        "<p>On the sidebar is an option to change the question layers displayed on the map. You can access questions " +
        "that have been sumbitted in the last week and ones closest to your location.</p>" +
        "<h4>Participation </h4>" +
        "<p>User participation can be viewed using the sidebar.</p>" +
        "<h4>Most difficult questions</h4>" +
        "<p>A list of the most difficult questions can be viewed using the sidebar.</p>" +
        "<h4>Notes about screen size</h4>" +
        "<p>If you are reading this you have been using the quiz component of the app on a large screen (&gt;991 pixels)." +
        " Due to the nature of the app and in the interests of computational efficiency, if the user wishes to change" +
        " the display they must reload the page. The app tailors display elements, such as the map window and the " +
        "participation graphs, to fit the screen size at the time of loading and altering this may cause " +
        "inconsistencies in user experience.</p>"
};

let loadSmallHelp = function () {
    document.getElementById("small-screen-wrapper").innerHTML =
        "<h3>Quiz help page</h3>" +
        "<h4>Welcome to the quiz</h4>" +
        "<p>This is the quiz component of the app, here you can answer questions that appear on the map.</p>" +
        "<h4>To answer a question</h4>" +
        "<p>To answer a question simply click/tap on one of the markers on the map and you will be prompted with a " +
        "question and the ability to answer with a drop down of potential choices. Hit 'Submit answer' to see how you " +
        "did.</p>" +
        "<h4>Location is important</h4>" +
        "<p>The position of the marker relates to the geographic location of a clue that can be used to get the right " +
        "answer. For this reason, the quiz is also proximity enabled, meaning that if you have allowed location access to" +
        " the web page a question will popup when you are within 200m of it.</p>" +
        "<h4>Using the quiz layers</h4>" +
        "<p>On the sidebar is an option to change the question layers displayed on the map. You can access the last 5 " +
        "ones answered and also polish up on your record by attempting questions you missed.</p>" +
        "<h4>Top scorers</h4>" +
        "<p>Top scoring users can be viewed using the sidebar.</p>" +
        "<h4>Notes about screen size</h4>" +
        "<p>If you are reading this you have been using the quiz component of the app on a small/medium screen " +
        "(&lt;992 pixels) or you are cheating the system by accessing this on a computer. Due to the nature of the app " +
        "and in the interests of computational efficiency, if the user wishes to change the display they must reload the " +
        "page. The app tailors display elements, such as the map window, quiz popups and the top scorer graph, to fit the" +
        " screen size at the time of loading and altering this may cause inconsistencies in user experience.</p>"
};