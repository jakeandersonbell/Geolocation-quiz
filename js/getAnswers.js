// This file handles the fetching of information relating to answers from the quizanswers database

// Setting up global variables
let allCorCount;
let userRank;
let topFiveUsers = {};
let ranks = [];
let rank_ids = [];
let scores = [];
let myPartDay = [];
let myPartAns = [];
let myPartCorr = [];
let partDay = [];
let partAns = [];
let partCorr = [];
let hards = [];

// Fetch functions
// These functions return a JSON result from the URL as an asynchronous ajax request
function fetchCorrect(handleData) {
    $.ajax({
        async:false,
        url: "https://developer.cege.ucl.ac.uk:30260/getCorrectAnswers/" + httpsPortNumberAPI,
        success:function(data) {
            handleData(data);
        }
    });
}

function fetchRank(handleData) {
    $.ajax({
        async:false,
        url: "https://developer.cege.ucl.ac.uk:30260/getUserRank/" + httpsPortNumberAPI,
        success:function(data) {
            handleData(data);
        }
    });
}

function fetchTopFive(handleData){
    $.ajax({
        async:false,
        url: "https://developer.cege.ucl.ac.uk:30260/topFive/",
        success:function(data) {
            handleData(data);
        }
    });
}

function fetchMyParticipation(handleData) {
    $.ajax({
        async:false,
        url: "https://developer.cege.ucl.ac.uk:30260/myDailyParticipation/" + httpsPortNumberAPI,
        success:function(data) {
            handleData(data);
        }
    });
}

function fetchParticipation(handleData) {
    $.ajax({
        async:false,
        url: "https://developer.cege.ucl.ac.uk:30260/dailyParticipation/",
        success:function(data) {
            handleData(data);
        }
    });
}

function fetchHard(handleData){
    $.ajax({
        async:false,
        url: "https://developer.cege.ucl.ac.uk:30260/hardQuestions/",
        success:function(data) {
            handleData(data);
        }
    });
}


// The associated get functions
// These call the fetch functions and allow the result to be assigned to variables in the global scope
function getCorrect() {
    // Get the number of correct answers for port id variable
    fetchCorrect(function (output) {
        allCorCount = output[0].array_to_json[0].num_questions;
    });
}

function getRank() {
    // Get the users rank
    fetchRank(function (output) {
        userRank = output[0].array_to_json[0].rank;
    });
}

function getTopFive() {
    // Loop through the JSON object and add the values to specific arrays
    fetchTopFive(function (output) {
        for(let i = 0; i < output[0].array_to_json.length; i++){
            ranks[i] = output[0].array_to_json[i]["rank"];
            rank_ids[i] = output[0].array_to_json[i]["port_id"];
            topFiveUsers[output[0].array_to_json[i]["port_id"]] = output[0].array_to_json[i]["rank"];
            // The port number gets reset to the id in question with each iteration
            // as unsure how to pass parameter into request, this works
            httpsPortNumberAPI = output[0].array_to_json[i]["port_id"];
            // Get number of correct for that port ID
            getCorrect();
            scores[i] = allCorCount;
        }
        // Reset ports when all is done
        getPorts();
    });
}

function getMyParticipation() {
    // Get measure of how active current user has been on each day
    // Loop through days in object, appending result to array
    fetchMyParticipation(function (output) {
        // If the user has not been active for enough days don't try to get a weeks worth
        let max = output[0].array_to_json.length;
        if(output[0].array_to_json > 7){
            max = 8
        }
        for(let i = 0; i < max; i++) {
            myPartDay[i] = output[0].array_to_json[i]["day"];
            myPartAns[i] = output[0].array_to_json[i]["questions_answered"];
            myPartCorr[i] = output[0].array_to_json[i]["questions_correct"];
        }
    });
}

function getParticipation() {
    // Get measure of how active all users have been on each day
    // Same as getMyParticipation()
    fetchParticipation(function (output) {
        let max = output[0].array_to_json.length;
        if(output[0].array_to_json > 7){
            max = 8
        }
        for(let i = 0; i < max; i++) {
            partDay[i] = output[0].array_to_json[i]["day"];
            partAns[i] = output[0].array_to_json[i]["questions_answered"];
            partCorr[i] = output[0].array_to_json[i]["questions_correct"];
        }
    });
}

function getHardest() {
    // Get array of hardest questions
    fetchHard(function (output) {
        for(let i = 0; i < output[0].array_to_json.length; i++){
            hards[i] = output[0].array_to_json[i]["question_text"];
        }
    });
}