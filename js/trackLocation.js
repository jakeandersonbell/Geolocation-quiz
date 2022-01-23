// This file handles the user location

let userPos;
let found = false;
let closest = false;
let open = false;

function trackLocation() {
    // Check to see if geoloaction is supported; calls show position
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
        document.getElementById('showLocation').innerHTML =
            "Geolocation is not supported by this browser"
    }
}

function showPosition(position){
    // Check if position marker exists on map, remove if so
    if(quizMap === undefined){
        if (userPos !== undefined) {
            setMap.removeLayer(userPos);
        }
    }else {
        if (userPos !== undefined) {
            quizMap.removeLayer(userPos);
        }
    }
    // Create/update userPos marker object
    userPos = L.circleMarker([position.coords.latitude, position.coords.longitude], {
        radius: 10
    });
    // Add it to map
    if(quizMap === undefined){
        if (userPos !== undefined) {
            userPos.addTo(setMap);
        }
    }else {
        if (userPos !== undefined) {
            userPos.addTo(quizMap);
        }
    }
}

let checkProximity = function() {
    // Proximity check
    // Don't want to open popup if one is already open
    // If a popup isn't open
    for (let key in markers) {
        if (markers[key].getPopup()._isOpen) {
            open = true;
        }
    }
    // If the closest hasn't been found
    if (!found) {
        // start counting how many are in proximity, if they are: increment count
        let count = 0;
        for (let key in markers) {
            if (markers[key].getLatLng().distanceTo(userPos.getLatLng()) < 2000) {
                count++;
            }
        }
        // If there is at least 1
        if (count > 0) {
            // Set variable for distance to compare to the rest, making a note of the object itself
            let distance = markers[Object.keys(markers)[0]].getLatLng().distanceTo(userPos.getLatLng());
            closest = markers[Object.keys(markers)[0]];
            // Loop through the rest
            for (i = 1; i < count; i++) {
                // If its closer reassign the variable to it
                if (markers[Object.keys(markers)[i]].getLatLng().distanceTo(userPos.getLatLng()) < distance) {
                    distance = markers[Object.keys(markers)[i]].getLatLng().distanceTo(userPos.getLatLng());
                    closest = markers[Object.keys(markers)[i]];
                }
            }
            // Set found as true... for now
            found = true;
        }
    }
    // If we have a closest open it up
    if (closest) {
        closest.openPopup();
    }

    // reset some global variables to which the function depends on
    found = false;
    open = false;
    // Wait a minute and run again, don't want to spam the user with popups, they might want to look at something else
    setTimeout(checkProximity, 60000)
};