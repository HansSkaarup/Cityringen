/**
 * Created by skodmunk on 16/06/2017.
 */
//MASTER FUNCTION 1 - Finds one-to-one and address (Coordinates) for origin/destination!
        function sqlfunction() {
        //Refreshes/Clears the search shown on the map.
        layerGroup.clearLayers();
        //Refreshes/Clears the commute routing when changing original address shown on the map.
        layerGroup2.clearLayers();
        //Refreshes/Clears minutemap.
         layerGroup3.clearLayers();
        // getJSON function that communicates with the PHP file(s) we created
        // And "adress" being the variable (street name, house number, postal code and postal name) for the SQL that gets sent to the the PHP document we call.
        $.when($.getJSON("php/postgis_geojson.php?geotable=adresser&fields=adresse, vejnavn&geomfield=geom&index=&orderby=&limit=&offset=&parameters=(vejnavn || ' ' || husnr || ', ' || postnr || ' ' || postnrnavn)= " + adress2, function (msg) {
                    console.log(msg);
                    adressedata = msg;
                    var geojsonphp3 = new L.GeoJSON(msg, {
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, {
                                icon: redMarker
                            });
                        },
                        onEachFeature: function (feature, layer) {
                            layer.bindPopup("<strong>" + feature.properties.adresse + "</strong><br/>")
                        }
                    });

                    layerGroup.addLayer(geojsonphp3);
                    mymap.setView(new L.LatLng(msg.features["0"].geometry.coordinates["1"], msg.features["0"].geometry.coordinates["0"] + 0.01), 13, {animation: true});
                }),

                $.getJSON("php/postgis_geojson.php?geotable=adresser&fields=adresse, vejnavn&geomfield=geom&index=&orderby=&limit=&offset=&parameters=(vejnavn || ' ' || husnr || ', ' || postnr || ' ' || postnrnavn)= " + commute, function (data7) {
                    destination = data7;
                    console.log(destination);
                    var geojsonphp6 = new L.GeoJSON(data7, {
                        pointToLayer: function (feature, latlng) {
                            return L.marker(latlng, {
                                icon: blueMarker
                            });
                        },
                        onEachFeature: function (feature, layer) {
                            layer.bindPopup("<strong>" + feature.properties.adresse + "</strong><br/>")
                        }
                    });

                    layerGroup2.addLayer(geojsonphp6);
                })


        ).then(route, failfunction)

  };

        function failfunction() {console.log(".Then function/SQL load failed")};

        function route() {
       //Getjson that skips the process of creating a seperate variable for storing and ordering coordinates
        $.getJSON('php/pgrouting.php?coordinates=' + adressedata.features["0"].geometry.coordinates["0"] + ',' +
                adressedata.features["0"].geometry.coordinates["1"] + ',' +
                destination.features["0"].geometry.coordinates["0"] + ',' +
                destination.features["0"].geometry.coordinates["1"], function (data8) {
            commutepgroutingdata = data8;
            console.log(data8);

            //Iteration function that summarizes the length values of the returned ways by parsing them to floats (send
            // as strings by the php script) and adding them together into the sumdistance variable.
            sumdistance = 0;
            var test,
                    features = commutepgroutingdata.features,
                    i;
            for (i = 0; i < features.length; i++) { //loop through array
                sumdistance += parseFloat(features[i].properties.cost);
            }



            //Display pg_routing result to map.
            var pgrouting2leaflet2 = new L.GeoJSON(data8, {
                 style: function(feature){
                        return { color: "#223b84", dashArray: "1", weight: 6}
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup("<strong>" + "Current fastest route" + "</strong><br/>")
                    }
                })

                layerGroup2.addLayer(pgrouting2leaflet2);
        }),

               //Getjson that skips the process of creating a seperate variable for storing and ordering coordinates
        $.getJSON('php/pgroutingfuture.php?coordinates=' + adressedata.features["0"].geometry.coordinates["0"] + ',' +
                adressedata.features["0"].geometry.coordinates["1"] + ',' +
                destination.features["0"].geometry.coordinates["0"] + ',' +
                destination.features["0"].geometry.coordinates["1"], function (data10) {
            Futureroute = data10;
            console.log(data10);

            //Iteration function that summarizes the length values of the returned ways by parsing them to floats (send
            // as strings by the php script) and adding them together into the sumdistance variable.
                                var fursumdistance = 0,
                    features2 = Futureroute.features,
                    i;
            for (i = 0; i < features2.length; i++) { //loop through array
                fursumdistance  += parseFloat(features2[i].properties.cost);
            }

             //Display pg_routing result to map.
            var pgrouting2leaflet3 = new L.GeoJSON(data10, {
                 style: function(feature){
                        return { color: "#FF0000", dashArray: "1 7", weight: 6}
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup("<strong>" + "Future fastest route" + "</strong><br/>")
                    }
                })

                layerGroup2.addLayer(pgrouting2leaflet3)
                        //Display result of iterating function to sidebar using Math.round to remove comma values and make it readable.
            document.getElementById("showdata1").innerHTML = 'Current estimated travel time: ' + Math.round((sumdistance / 60)) + ' minutes.';
            document.getElementById("showdata2").innerHTML = 'Future estimated travel time: ' + Math.round((fursumdistance/60)) + ' minutes.';
            document.getElementById("showdata3").innerHTML = 'The shortest commute route between '
                    + adressedata.features["0"].properties.adresse + ' and '
                    + destination.features["0"].properties.adresse + ' is represented by the lightblue line.';
        })

        };



