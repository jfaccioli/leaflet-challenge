// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
});

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {

    // fucntion to set marker colours
  function coulour(mag){
    switch (true) {
      case (mag>5):
          return "#d73027";
      case (mag>4):
          return "#fc8d59";          
      case (mag>3):
          return "#fee08b";
      case (mag>2):
          return "#d9ef8b";          
      case (mag>1):
          return "#91cf60";
      default:
          return "#1a9850";
    }}

  // function to create circle markers
  function circlemark(feature) {
    return {
        radius: feature.properties.mag * 5,
        weight: 0.2,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.8,
        fillColor: coulour(feature.properties.mag)
        };
      };

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><h4>Magnetude: " + feature.properties.mag + "</h4>");
      };

  // create maker layer
  L.geoJSON(data.features, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) { return L.circleMarker(latlng, circlemark(feature));
      }
      }).addTo(myMap);
 

  // create base layer
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
      }).addTo(myMap);

  // create legend      
  var legend = L.control({position: 'bottomright'});

  // create legend entries
  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1.5, 2.5, 3.5, 4.5, 5.5],
      labels = ["0-1","1-2","2-3","2-4","4-5","5+"];

    var listitems =[];

    for (var i = 0; i < grades.length; i++) {

      var item =
      "<li>" + '<i style="background:' + coulour(grades[i]) + '"></i> ' +
         labels[i] +"</li>";

         listitems.push(item);
    }

    div.innerHTML += "<ul>" + listitems + "</ul>"

    return div;
    };

  legend.addTo(myMap);

});