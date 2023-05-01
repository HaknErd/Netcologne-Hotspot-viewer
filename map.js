
function unhide() {
    document.body.setAttribute("class", "unhide")
}
function hide() {
    document.body.removeAttribute("class")
}

// Create a new map instance centered on a specific location
var map = L.map('map').setView([50.941357, 6.958307], 13);
var user = L.icon({
    iconUrl: 'http://leafletjs.com/examples/custom-icons/leaf-green.png',
    shadowUrl: 'http://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [38, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76],
})
// Add a tile layer to the map
var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 1,
    noWrap: true,
    detectRetina: true,
    reuseTiles: true
}).addTo(map);
var OSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 18,
    minZoom: 10,
    noWrap: true,
    reuseTiles: true
}).addTo(map);



// Load the JSON file
fetch('/data.json')
    .then(response => response.json())
    .then(data => {
        var markers = data.map(item => {
            return L.marker([item.coordinates[0], item.coordinates[1]]).bindPopup(item.name);
        });
        var markerCluster = L.markerClusterGroup();
        markerCluster.addLayers(markers);
        map.addLayer(markerCluster);
        //console.log(data); // Log the JSON data for debugging
        // Extract the coordinates from the JSON data
        // var heatmapData = data.map(item => {
        //     return {
        //         lat: item.coordinates[0],
        //         lng: item.coordinates[1],
        //         name: item.name,
        //     };
        // });
        // console.log(heatmapData); // Log the heatmap data for debugging
        // Create a heatmap layer and add it to the map
        // L.heatLayer(heatmapData, {
        //     // Use a function to map signal strength to opacity and intensity
        //     // Assumes signal strength is in dBm
        //     // Based on approximations of 2.4GHz Wi-Fi signal strength
        //     // See https://www.metageek.com/training/resources/wifi-signal-strength-basics.html
        //     minOpacity: 0.5,
        //     maxZoom: 15,
        //     radius: 40,
        //     blur: 20,
        // })
        //     .addTo(map);
        var radiuses = data.map(item => {
            return L.circle([item.coordinates[0], item.coordinates[1]], {
                radius: 50,
                color: [
                    'rgba(255, 0, 0, 0.4)',
                    'rgba(255, 255, 0, 0.5)',
                    'rgba(0, 255, 0, 0.6)',
                    'rgba(0, 255, 255, 0.7)',
                    'rgba(0, 0, 255, 0.8)',
                    'rgba(255, 0, 255, 0.9)',
                    'rgba(255, 0, 0, 1)'
                ]
            });
        });

        // Add the circles to the map
        radiuses.forEach(circle => {
            circle.addTo(map);
        });

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// placeholders for the L.marker and L.circle representing user's current position and accuracy    
var current_position, current_accuracy;

function onLocationFound(e) {
    // if position defined, then remove the existing position marker and accuracy circle from the map
    if (current_position) {
        map.removeLayer(current_position);
        map.removeLayer(current_accuracy);
    }

    var radius = e.accuracy / 1;

    current_position = L.marker(e.latlng, { icon: user })
        .addTo(map)
        .bindPopup("You are within " + radius + " meters from this point");

    current_accuracy = L.circle(e.latlng, radius).addTo(map);

}


function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// wrap map.locate in a function    
function locate() {
    map.locate({ setView: false });
}

// call locate every 3 seconds... forever
setInterval(locate, 3000);
locate()
unhide();
