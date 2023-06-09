// Create a new map instance centered on a specific location
var map = L.map('map').setView([50.941357, 6.958307], 14);
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
    maxZoom: 19,
    noWrap: true,
}).addTo(map);




// Load the JSON file
fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
        var markers = data.map(item => {
            return L.marker([item.coordinates[0], item.coordinates[1]]).bindPopup(item.name);
        });
        var markerCluster = L.markerClusterGroup();
        markerCluster.addLayers(markers);
        map.addLayer(markerCluster);
        console.log(data); // Log the JSON data for debugging
        // Extract the coordinates from the JSON data
        var heatmapData = data.map(item => {
            return {
                lat: item.coordinates[0],
                lng: item.coordinates[1],
                name: item.name,
            };
        });
        console.log(heatmapData); // Log the heatmap data for debugging
        // Create a heatmap layer and add it to the map
        L.heatLayer(heatmapData, {
            // Use a function to map signal strength to opacity and intensity
            // Assumes signal strength is in dBm
            // Based on approximations of 2.4GHz Wi-Fi signal strength
            // See https://www.metageek.com/training/resources/wifi-signal-strength-basics.html
            minOpacity: 0.01,
            maxOpacity: 1,
            radius: 40,
            blur: 20,
            maxZoom: 16,

        })
            .addTo(map);


        var circles = data.map(item => {
            return L.circle([item.coordinates[0], item.coordinates[1]], {
                radius: 50,
                minZoom: 17,
                opacity: 0.2,
                color: [
                    'rgba(255, 0, 0, 1)'
                ]
            });
        });
        // Add the circles to the map
        circles.forEach(circle => {
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
    console.log(e.message);
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
