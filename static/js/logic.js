console.log("logic.js loaded")

// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var quakes = new L.LayerGroup();






// function markerSize(mag){
//   return mag;
// }



// function markerColor(mag){

//   if (mag <= 1.5) {
//     return "green";

//   } else if (mag <= 3.5){
//     return "yellow";

//   } else 
//     return "red"; 

//   };

// L.circle(latlng, {

//   radius: markerSize(feature.properties.mag),
//   fillColor: markerColor(feature.properties.mag),
//   fillOpacity: 1, 
//   stroke: false,

// })




// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  



  createFeatures(data.features);
  console.log(data.features)
});

function createFeatures(earthquakeData) {

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

// Sending our earthquakes layer to the createMap function
  createMap(earthquakes);


  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
        console.log(latlng)
        console.log(quakes)
      return L.circleMarker(latlng);
    },
    onEachFeature: onEachFeature
  }).addTo(quakes);
  quakes.addTo(myMap);

  function onEachFeature(feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3>" + 'Date & Time:' + ' ' + new Date(feature.properties.time) + "</p>" +  
      "</h3>" + 'Magnitude:' + ' ' + (feature.properties.mag));
  }
  
    
  

  

  
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [37.0902, -95.7129],
  zoom: 5,
  layers: [streetmap, earthquakes]
});

  

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
