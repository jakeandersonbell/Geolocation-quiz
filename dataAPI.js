// express is the server that forms part of the nodejs program 
var express = require('express'); 
var path = require("path"); 
var app = express(); 
var fs = require('fs'); 
 
// add an https server to serve files  
var https = require('https'); 
var privateKey = fs.readFileSync('/home/studentuser/certs/cert.key').toString(); 
var certificate = fs.readFileSync('/home/studentuser/certs/cert.crt').toString();   
 
var credentials = {key: privateKey, cert: certificate}; 
var httpsServer = https.createServer(credentials, app); 

// This is required so that the NodeJS code can read through the individual name/value pairs
// that are posted by the form that we will creat in part 2
const bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({ extended: true })); 
 
httpsServer.listen(4480); 
 
app.get('/',function (req,res) {  
	res.send("hello world from the Data API"); 
}); 

// adding functionality to allow cross-origin queries when PhoneGap is running a server 
app.use(function(req, res, next) {  
	res.setHeader("Access-Control-Allow-Origin", "*");  
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");  
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');  
	next(); 
}); 

// adding functionality to log the requests  
app.use(function (req, res, next) {   
	var filename = path.basename(req.url);   
	var extension = path.extname(filename);   
	console.log("The file " + filename + " was requested.");   
	next();  
});

// adding CORS 
app.use(function(req, res, next) {   
res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from   
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");   
next(); 
});

// Add code to inform this file about the route to the geoJSOn file
// note that atm we do not have  a express.static statement 
// in this code, as we will only ever be serving data, not static files.
const geoJSON = require('./routes/geoJSON.js'); 
app.use('/', geoJSON); 

const crud = require('./routes/crud.js'); 
app.use('/', crud); 

