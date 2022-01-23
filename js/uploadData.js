// This file handles all uploading of data to the databases

let seshCorCount = 0;

function startQuestionUpload(){
	// This function uploads questions to the DB, starts when user clicks submit
	alert ("Start data upload");

	// Get the relevant values
	var latitude = document.getElementById("latitude").value;
	var longitude = document.getElementById("longitude").value;
	var question_title = document.getElementById("question_title").value;
	var question_text = document.getElementById("question_text").value;
	var answer1 = document.getElementById("correct").value;
	var answer2 = document.getElementById("incorrect1").value;
	var answer3 = document.getElementById("incorrect2").value;
	var answer4 = document.getElementById("incorrect3").value;

	// Check if lat/lng have no value
	// Check that other fields aren't the default value
	// Check that other fields are not just whitespace
	if(latitude === "" || longitude === "" || question_title.replace(/\s/g, '').length === 0 ||
		question_title === "Enter Question Title" || question_text.replace(/\s/g, '').length === 0 ||
		question_text === "Type out the question here" || answer1.replace(/\s/g, '').length === 0 ||
		answer1 === "Enter Correct Answer" || answer2.replace(/\s/g, '').length === 0 ||
		answer2 === "Enter Incorrect Answer 1" || answer3.replace(/\s/g, '').length === 0 ||
		answer3 === "Enter Incorrect Answer 2" || answer4.replace(/\s/g, '').length === 0 ||
		answer4 === "Enter Incorrect Answer 3"){
		alert("You did not complete the form correctly! Please try again.");
		return;
	}

	// Parse all to a post string
	var postString = "question_title=" + question_title + "&question_text=" + question_text + "&answer1=" + answer1 +
		"&answer2=" + answer2 + "&answer3=" + answer3 + "&answer4=" + answer4;

	postString = postString +"&port_id=" + httpsPortNumberAPI;

	postString = postString + "&correct_answer=1&longitude=" + longitude + "&latitude=" + latitude;

	processQuestionData(postString);

	// reload data to show new
	getQuizData(setMap);
}

function startAnswerUpload(){
	// Gather the data contained in elements for sending
	let givenAnswer = document.getElementById("answerselectbox").value;
	// answers is the hidden element containing the non-shuffled array of answers
	let ordered_answers = document.getElementById("answers").innerHTML.split(',');
	// The index of the selected answer needs to be found in the non-shuffled array
	let answer_selected = ordered_answers.indexOf(givenAnswer) + 1;
	// Correct answer from hidden html element
	let correct_answer = parseInt(document.getElementById("correct").innerHTML);
	// Question id stored in hidden element
	let question_id = document.getElementById("question_id").innerHTML;

	// Initialise some styles to change marker to depending on result
	let testMarkerRed = L.AwesomeMarkers.icon({
		icon: 'play',
		markerColor: 'red'}
	);
	let testMarkerGreen = L.AwesomeMarkers.icon({
		icon: 'play',
		markerColor: 'green'}
	);
	// Check answer and alert and change colour of marker
	if(answer_selected === correct_answer){
		// Increment session count and get count of all correct
		getCorrect();
		seshCorCount += 1;
		alert("Congratulations! You answered the question correctly!");
		markers[parseInt(question_id)].setIcon(testMarkerGreen);
	}else{
		alert("That answer was incorrect.");
		markers[parseInt(question_id)].setIcon(testMarkerRed);
	}

	// check if alert should be plural
	let seshAns = "answers";
	if(seshCorCount === 1){
		seshAns = "answer"
	}
	let allAns = "answers";
	if(allCorCount === 1){
		allAns = "answer"
	}

	// Send alerts to user of their rank
	alert("You have given " + seshCorCount + " correct " + seshAns + " in this session.");
	alert("You have given " + allCorCount + " correct " + allAns + " overall.");
	alert ("Start data upload");

	let postString = "port_id=" + httpsPortNumberAPI + "&question_id=" + question_id + "&answer_selected=" + answer_selected +
		"&correct_answer=" + correct_answer;


	processAnswerData(postString);
}

function processQuestionData(postString) {
	// Function to send poststring to appropriate url
	var serviceUrl= "https://developer.cege.ucl.ac.uk:"+ httpsPortNumberAPI+"/insertQuestionData";
	$.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "POST",
		success: function(data){console.log(data); dataUploaded(data);},
		data: postString
	});
}

function processAnswerData(postString) {
	// Function to send poststring to appropriate url
	var serviceUrl= "https://developer.cege.ucl.ac.uk:"+ httpsPortNumberAPI+"/insertAnswerData";
	$.ajax({
		url: serviceUrl,
		crossDomain: true,
		type: "POST",
		success: function(data){console.log(data); dataUploaded(data);},
		data: postString
	});
}

function dataUploaded() {
	// Alert the user to their data being uploaded
	alert("Your data has been uploaded successfully!");
}

function deleteQuestion() {
	// Remove question from database given question ID
	var deleteID = document.getElementById("deleteID").value;
	var deleteString = "id="+deleteID + "&port_id="+httpsPortNumberAPI;  
	var serviceUrl= "https://developer.cege.ucl.ac.uk:"+ httpsPortNumberAPI+"/deleteQuestionData";
	$.ajax({      
		url: serviceUrl,      
		crossDomain: true,      
		type: "POST",      
		success: function(data){console.log(data); dataDeleted(data);},      
		data: deleteString 
	});
} 

function dataDeleted(data){
	// Alert the user to their data being deleted
	document.getElementById("dataDeleteResult").innerHTML = JSON.stringify(data);
	getQuizData(setMap);
}
