var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function circleSize(mag) {
    return mag * 10000;
  };
  
  function circleColor(mag) {
    if (mag <= 1) {
        return "#00FF00";
    } else if (mag <= 2) {
        return "#008000";
    } else if (mag <= 3) {
        return "#FFFF00";
    } else if (mag <= 4) {
        return "#F3BA4D";
    } else if (mag <= 5) {
        return "#FF0000";
    } else {
        return "#800000";
    };
  }

  var earthquakes = L.geoJSON(earthquakeData, {

 onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>Location:" + feature.properties.place +
      "</h3><hr><p>Date & Time:" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: circleSize(feature.properties.mag),
        fillColor: circleColor(feature.properties.mag),
        color:circleColor(feature.properties.mag),
        fillOpacity: 0.75,
    })
  }
  });
    
  createMap(earthquakes);
}

function createMap(earthquakes) {

  var streetsbasic = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
});

  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [streetsbasic, earthquakes]
  });

  var legend = L.control({ position: 'bottomright' })

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend');
      var magnitude = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
      var colorScheme = ["#00FF00","#008000","#FFFF00", "#F3BA4D", "#FF0000","#800000"];
        
      for (var i = 0; i < magnitude.length; i++) {
          div.innerHTML +=
          '<p style="margin-left: 15px">' + '<i style="background:' + colorScheme[i] + ' "></i>' + '&nbsp;&nbsp;' + magnitude[i]+ '<\p>';
        }
  
      return div;
  };
  
  legend.addTo(myMap);
}

