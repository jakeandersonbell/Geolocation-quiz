Geolocation Quiz Application
========================
This is a technical guide for a location-based quiz web application. There are two main user components to the application: **(1)** a desktop-based question setting component where users can add questions to a database and **(2)** a mobile-based component where users can answer questions obtained from the database. The users location is used aid the user in navigating to question points and setting new questions.

## System Requirements

* Users will require an internet connection and a web browser that supports location access to use the full functionality, although the app will work without sharing location. 

* The server requires a process manager that supports Node.js to run. This has been acheived using PM2 running remotely on an Ubuntu server with BitVise being used as SSH.

* In addition to the requirement of a GPS receiver, the application makes use of the w3C Geolocation API which is supported by Firefox 3.5+, Chrome 5.0+, Safari 5.0+, Opera 10.6+, Internet Explorer 9.0+. 


## Deployment

The following will run through the process to get the application running that has been used in development.

1. After opening a terminal and navigating to the desired location on the Ubuntu server clone the repository.
```git clone https://github.com/ucl-geospatial/cege0043-apps-jakeandersonbell.git```
2. Run pm2 start on dataAPI.js to get the Node server running.
```pm2 start dataAPI.js```
3. Run pm2 start on app.js to get the http server running.
```pm2 start app.js```
4. Change the port numbers in **res/ports.xml**


## Testing

1. After getting the Node.js servers running, navigate to https://developer.cege.ucl.ac.uk: <YOUR API PORT NUMBER> in your browser. After ignoring any security warnings (there is no SSL certificate) you should be met with:
```hello world from the Data API```
2. Navigate to https://developer.cege.ucl.ac.uk: <YOUR APP PORT NUMBER> and you should be met with:
```Hello World from the HTTPS Server```
3. Once the servers are running navigate to https://developer.cege.ucl.ac.uk: <YOUR APP PORT NUMBER>/bootStrap.html to use the app.
4. If you get any issues open up the developer tools console and check for errors


## File Description

* CSS
    * sb-admin-2.css – Bootstrap style
    * style.css – Project style
* js
    * basicMap.js – Setting up basic map objects
    
|**Function**| **Description**  |
|---|---|
| getCoords()  | When the user clicks the map it gets the lat/long and displays it as a marker  |
| loadSetMap()  | Calculate the available space for the question setting map and create the map object  |
| loadQuizMap()  | Calculate the available space for the quiz setting map and create the map object  |

   * getAnswers.js – Fetch information from the quizanswers database

|**Function**| **Description**  |
|---|---|
| fetchCorrect()  | Make a synchronous ajax request to get the users number of correct answers   |
|fetchRank()   | Make a synchronous ajax request to get the users rank   |
|fetchTopFive()   | Make a synchronous ajax request to get the users rank   |
|fetchMyParticipation()   | Make a synchronous ajax request to get the users weekly participation   |
|fetchParticipation()   | Make a synchronous ajax request to get all user weekly participation  |
|fetchHard()   | Make a synchronous ajax request to get the 5 most difficult questions  |
|getCorrect()   | Call fetchCorrect() and store result as global variable  |
|getRank()   | Call fetchRank() and store result as global variable  |
|getTopFive()   | Call fetchTopFive() and store result as global variable  |
|getMyParticipation()   | Call fetchMyParticipation() and store result as global variable  |
|getParticipation()   | Call fetchParticipation() and store result as global variable  |
|getHardest()   | Call fetchHard() and store result as global variable  |

   * menu.js – Loading page and displaying content

|**Function**| **Description**  |
|---|---|
| topFiveGraph()  | Generate a CSS bar graph of the top 5 scoring users  |
| myPartGraph()  | Generate a graph of the users past week participation |
| partGraph()  | Generate a graph of all usesr past week participation  |
| showHardest()  | Show a list of the 5 most difficult question titles  |
| loadTop()  | Create a HTML element to store result and call topFiveGraph()  |
| loadRank()  | Create a HTML element to store user rank  |
| loadHard()  | Create a HTML element to store result and call showHardest()  |
| loadParticipation()  | Create a HTML element to store result and call myPartGraph() and partGraph() |
| initialPageLoad()  | Check screen size and load all required content  |
| loadQuizPage()  | Load page structure and content for quiz component  |
| loadSetPage()  | Load page structure and content for question setting component  |
| checkAll(), checkMissing(),<br/>checkLast(), checkSet(),<br/>checkWeek(), checkNear() | Check the state of map layer checkboxes and add/remove layer accordingly  |
| loadBigHelp(), loadSmallHelp()  | Load help page content  |

   * plotData.js – Adding question data to the map

|**Function**| **Description**  |
|---|---|
| getQuizData()  | Get the users question markers for the question setting component  |
| doQuiz()  | Get the users question markers for the quiz component  |
| getWeeksData()  | Get all users question markers created in the last week for the question setting component |
| getNearData()  | Get all users question markers near the users location for the question setting component  |
| getLastData()  | Get the markers for the last 5 questions the user answered for the quiz component   |
| getMissedData()  | Get the markers for the questions the user hasn't answered or answered incorrectly for the quiz component  |

   * sb-admin-2.js – Bootstrap events
   * trackLocation.js – User location functionality



|**Function**| **Description**  |
|---|---|
| trackLocation()  | Get users geolocation  |
| showPosition()  | Display the users position on the map  |
| checkProximity()  | Find the closest question to the user and open the popup  |

   * uploadData.js – Uploading of data to databases and some error handling

|**Function**| **Description**  |
|---|---|
| startQuestionUpload()  | Extract the from element values, perform some error handling and construct the post string   |
| startAnswersUpload()  | Check if answer is correct and change marker colour  |
| processQuestionData()  | Send the question post string to the database  |
| processAnswerData()  | Send the quiz post string to the database  |
| dataUploaded(), deleteQuestion(),<br/>dataDeleted()  | Alert user of successful upload/deletion  |

   * utilities.js – Miscellaneous functions

|**Function**| **Description**  |
|---|---|
| getPorts()  | Access the user ports specified in ./res/ports.xml  |
| shuffle()  | Randomly shuffle the order of an array  |

* res
   * ports.xml – Holds user port ID
* routes
   * crud.js – Sets up database post connections
   * geoJSON.js – Sets up database get connections
* app.js – A Node JS server to host the front-end
* dataAPI.js – A Node JS server to host the back-end, giving connection to routes
* bootstrap.html – The HTML file to access app


## Code Reference

* Code relating to database connections and the servers, including all SQL, is adapted from code provided in [CEGE0043 Web and Mobile GIS - Apps and Programming](https://moodle-1819.ucl.ac.uk/course/view.php?id=1330) by Claire Ellul

* Code used in the CSS graphs is adapted from [Mike Bostock's guide](https://observablehq.com/@d3/lets-make-a-bar-chart)

*  Base map layers are provided by [OpenStreetMap](https://www.openstreetmap.org/)

*  All mapping display functionality is provided by [Leaflet](https://leafletjs.com/)