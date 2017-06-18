/**
 * Created by skodmunk on 16/06/2017.
 */


//MASTER FUNCTION - Finds id and .then to the rest of minutemap chain:
        function onetomany() {
             //Refreshes/Clears minutemap.
         layerGroup3.clearLayers();

            if (typeof info !== 'undefined') {
                mymap.removeControl(info);
            };
            //.when and getJSON
            $.when($.getJSON('php/samplepointid.php?adresse=' + adressedata.features["0"].geometry.coordinates["0"] + ',' +
                adressedata.features["0"].geometry.coordinates["1"], function (verticedata) {
                        console.log(verticedata.features["0"].properties.cur_id);
                        verticeid = verticedata.features["0"].properties.cur_id;
                    })
            ).then (queryminutemap, minutemapfail)
        };



//SQL query to get minutemap grid and travel data based on Pgrouting.
      function queryminutemap() {
            $.when($.getJSON('php/minutemap.php?vertice=' + verticeid, function (minutemap) {
                        console.log(minutemap);
                        minutemapdata = minutemap;
                    })
            ).then (visualizeminutemap, minutemapfail2)
        };

//MASTER FUNCTION FUTURE - Finds id and .then to the rest of minutemap chain:
         function randomuniquename() {
             //Refreshes/Clears minutemap.
         layerGroup3.clearLayers();

            if (typeof info !== 'undefined') {
                mymap.removeControl(info);
            };
            //.when and getJSON
            $.when($.getJSON('php/fur_samplepointid.php?adresse=' + adressedata.features["0"].geometry.coordinates["0"] + ',' +
                adressedata.features["0"].geometry.coordinates["1"], function (verticedata) {
                        console.log(verticedata.features["0"].properties.fur_id);
                        verticeid = verticedata.features["0"].properties.fur_id;
                    })
            ).then (randomuniquename2, minutemapfail)
        };


//SQL query to get minutemap grid and travel data based on Pgrouting.
        function randomuniquename2() {
            $.when($.getJSON('php/fur_minutemap.php?vertice=' + verticeid, function (minutemap) {
                        console.log(minutemap);
                        minutemapdata = minutemap;
                    })
            ).then (visualizeminutemap, minutemapfail2)
        };


        function minutemapfail() {
        console.log("minutemap Sample point ID failed to load")
        }
        function minutemapfail2() {
            console.log("minutemap data failed to load")
        }

        //Shows the minutemap and contains hover/info/highlight functions
        function visualizeminutemap() {


    // control that shows state info on hover
    info = L.control({position: 'topleft'});

	info.onAdd = function (mymap) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};


// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Traveltime from origin: </h4>' +  (props ?
        '<b>' + props.cost_m + ' minutes </b>'
        : 'Hover over a hexagon');
	};

	info.addTo(mymap);

            function getColor(d) {
                return  d > 70 ? '#e31a1c' :
                        d > 60 ? '#fc4e2a' :
                        d > 50 ? '#fd8d3c' :
                        d > 40 ? '#feb24c' :
                        d > 30 ? '#fed976' :
                        d > 25 ? '#ffeda0' :
                        d > 20 ? '#ffffcc' :
                        d > 15 ? '#d9f0a3' :
                        d > 10 ? '#addd8e' :
                        d > 5  ? '#41ab5d' :
                        d > 2  ? '#238443' :
                        d > 0  ? '#005a32' :
                                 '#FFEDA0';

            }

            function style(feature) {
                return {
                    fillColor: getColor(feature.properties.cost_m),
                    weight: 0.5,
                    opacity: 4,
                    color: 'black',
                    fillOpacity: 0.7
                };

            }


            //Functions that proc on listeners
            function highlightFeature(e) {
             var layer = e.target;

            layer.setStyle({
             weight: 5,
             color: '#666',
             dashArray: '',
             fillOpacity: 0.7
            });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        info.update(layer.feature.properties);
    }
        function resetHighlight(e) {
            minutemap2leaflet.resetStyle(e.target);
            info.update();
        }
    //Listener functions
    function zoomToFeature(e) {
        mymap.fitBounds(e.target.getBounds());
    }
        function onEachFeature(feature, layer) {
        layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}


    minutemap2leaflet = new L.GeoJSON(minutemapdata, {
        style: style,
        onEachFeature: onEachFeature
    });

layerGroup3.addLayer(minutemap2leaflet);


            /*
        geojson = L.geoJson(minutemap2leaflet, {
        style: style,
         onEachFeature: onEachFeature
        }).addTo(map);
*/



        };




            //ADD MINUTEMAP with styles and listernes to layergroup3 and then to the map



             //Display pg_routing result to map.
            /*var pgrouting2leaflet4 = new L.GeoJSON(minutemap, {
                 style: function(feature){
                        switch (feature.properties.mcost) {
                            case '40': return {color: "#FF0000", weight: 6}
                            case '40': return {color: "#FF0000", weight: 6}
                        }
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup("<strong>" + "minutemap.features" + "</strong><br/>")
                    }
                })

            layerGroup2.addLayer(pgrouting2leaflet4) */