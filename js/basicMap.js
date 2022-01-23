// This file handles the setting up of the basic map objects

// Global variables to store the maps
// Both components of the app are treated separately to avoid confusion over functionality and dimensions
let setMap;
let quizMap;


// create a custom popup as a global variable
var popup = L.popup();
// create an event detector to wait for the user's click event and then use the popup to show them where they clicked
// note that you don't need to do any complicated maths to convert screen coordinates to real world coordiantes - the
// Leaflet API does this for you
function getCoords(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(setMap);
    document.getElementById('latitude').value = e.latlng.lat.toFixed(5);
    document.getElementById('longitude').value = e.latlng.lng.toFixed(5);
    console.log(e.latlng.lat)
}

// Load map for question setting component
function loadSetMap() {
    // Map dimensions dependent on screen
    $("#setmapid").css({
        height: height + "px"
    });
    $("#setmapid").css({
        width: (Math.floor(space / 12) * 7 - 25) + "px"
    });
    // load the map centred on quiz centroid
    setMap = L.map('setmapid').setView([51.55626, -0.14557], 13);
    // load the tiles
    // Mapbox tiles
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <ahref="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(setMap);
    setMap.on('click', getCoords);
}

// Map for quiz component
function loadQuizMap() {
    // Dimensions dependent on screen
    $("#quizmapid").css({
        height: height + "px"
    });
    $("#quizmapid").css({
        width: (width - sidebar) + "px"
    });
    // load the map centred on quiz centroid
    quizMap = L.map('quizmapid').setView([51.55626, -0.14557], 13);
    // load the tiles
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <ahref="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(quizMap);
}


