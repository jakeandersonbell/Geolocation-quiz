function getLocation() {
    alert('Getting location');
    navigator.geolocation.getCurrentPosition(getPosition);
}

function getPosition(position) {
    document.getElementById('latitude').value=position.coords.latitude.toFixed(5);
    document.getElementById('longitude').value=position.coords.longitude.toFixed(5);
}