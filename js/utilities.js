var httpsPortNumberAPI; 
var httpsPortNumberApp;


function getPorts(){ 
	var portURL = "res/ports.xml";     
	$.get({url: portURL, success: function(result){
	    // console.log(result); // check that the data is correct
	httpsPortNumberApp = result.getElementsByTagName("node-port-https-app").item(0).textContent;         
	httpsPortNumberAPI = result.getElementsByTagName("node-port-https-api").item(0).textContent;         
	console.log("Port API : " + httpsPortNumberAPI);         
	console.log("Port APP : " + httpsPortNumberApp);
	    }, // end of the inner function         
	async: false  
	}); // end of the ajax request

} // end of the outer function

// Function to shuffle array, adapted from: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
