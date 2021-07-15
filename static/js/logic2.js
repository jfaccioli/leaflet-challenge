// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a function setting a colour depending on the magnetude (red to green)
function colour(magnitude) {
  if (magnitude > 5) {
      return "#FF0000";
  } else if (magnitude > 4) {
      return "#FF8C00";
  } else if (magnitude > 3) {
      return "#FFC100";
  } else if (magnitude > 2) {
      return "#FFF600";
  } else if (magnitude > 1) {
      return "#D4FF00"
  } else {
      return "#00FF00";
  };
};

// Create a function for the circle markers
function circle(feature) {
  return {
      radius: feature.properties.mag * 5,
      weight: 1,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.8,
      fillColor: markerColor(feature.properties.mag)
      };
    };

// Create a function setting a colour for the legend
function legendColour(magnetude) {
  switch(magnetude) {
      case '< 1.0':
          return "#00FF00"
      case '1.0 - 2.0':
          return "#D4FF00"
      case '2.0 - 3.0':
          return "#FFF600"
      case '3.0 - 4.0':
          return "#FFC100"
      case '4.0 - 5.0':
          return "#FF8C00"
      case '> 5.0':
          return "#FF0000"
  };
};

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>" + feature.properties.mag + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) { return L.circleMarker(latlng, circle(feature));
    }
  }).addTo(myMap)

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
    L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: API_KEY
    });



  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
