// Changes that may help:
// Very close with the New Layer defined but call it earthquakes instead of quakes so it matches the layer below
// Shalesh may have been saying this but I misunderstood what he was meaning.
// I simplied the structure so there were not as many functions and I moved the new layer group to be after the basemaps with the updated variable name.


console.log("logic.js loaded")

// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


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

var earthquakes = new L.LayerGroup();

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



function markerSize(mag){
  return mag *5;
}



function markerColor(mag){

  if (mag <= 1) {
    return "green";
  } 
  else if (mag <= 3){
    return "yellow";
  } 
  else if (mag <= 5){
    return "orange";
  } 
  else 
    return "red"; 

  };

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {

  console.log(data.features);

    // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        // add functions here like the below:
        radius: markerSize(feature.properties.mag),       // or function()
        // color: "white",
        fillColor: markerColor(feature.properties.mag),  // or function()
        fillOpacity: .8,
        stroke: false
      });
    },
    onEachFeature: onEachFeature
  }).addTo(earthquakes);
  earthquakes.addTo(myMap);

});


function onEachFeature(feature, layer) {

  layer.bindPopup("<h3>" + feature.properties.place +
    "</h3>" + 'Date & Time:' + ' ' + new Date(feature.properties.time) + "</p>" +  
    "</h3>" + 'Magnitude:' + ' ' + (feature.properties.mag));
}


//to add other geojson file shapes you can create a new setup just like above

// define query url
// d3.json(....function(data){  like above
// L.geoJSON(data, { ....
// at the end of the above geojson function is like what you ahve above, see below example
// }).addTo(earthquakes);
// earthquakes.addTo(myMap);
// });   //closes d3.json( from above.

var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          
          magGroups = [0, 1, 3, 5];

          div.innerHTML += '<h3>Magnitude</h3>';    
          
  
      for (var i = 0; i < magGroups.length; i++) {
          div.innerHTML +=

                        
              '<i style="background:' + markerColor(magGroups[i] + 1) + '"></i> ' + 
      + magGroups[i] + (magGroups[i + 1] ? ' - ' + magGroups[i + 1] + '<br>' : ' + ');
      }

      
  
      return div;
  };
  
  legend.addTo(myMap);














  
  



