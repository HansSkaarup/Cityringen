//MASTER FUNCTION - Finds id and .then to the rest of minutemap chain:
        function dif_minutemap() {
             //Refreshes/Clears minutemap.
         layerGroup3.clearLayers();

            if (typeof info !== 'undefined') {
                mymap.removeControl(info);
            };
            //.when and getJSON
            $.when($.getJSON('php/samplepointid.php?adresse=' + adressedata.features["0"].geometry.coordinates["0"] + ',' +
                adressedata.features["0"].geometry.coordinates["1"], function (verticedata) {
                        console.log(verticedata.features["0"].properties.cur_id);
                        dif_verticeid = verticedata.features["0"].properties.cur_id;
                    })
            ).then (dif_minutemapfuture, difminutemapfail)
        };



         function dif_minutemapfuture() {
             //Refreshes/Clears minutemap.
         layerGroup3.clearLayers();

            if (typeof info !== 'undefined') {
                mymap.removeControl(info);
            };
            //.when and getJSON
            $.when($.getJSON('php/fur_samplepointid.php?adresse=' + adressedata.features["0"].geometry.coordinates["0"] + ',' +
                adressedata.features["0"].geometry.coordinates["1"], function (verticedata2) {
                        console.log(verticedata2.features["0"].properties.fur_id);
                        dif_fur_verticeid = verticedata2.features["0"].properties.fur_id;
                    })
            ).then (dif_minutemapquery, difminutemapfail)
        };

        function difminutemapfail() {console.log("Difference map ID's failed to query")}

        function dif_minutemapquery() {
         $.when($.getJSON('php/dif_minutemap.php?vertice=' + "With i as (" +
"SELECT DISTINCT ON (end_vid) *, agg_cost/60 as cost_m, samplepoint_vertice_comparison.geom as pointgeom " +
"FROM current.samplepoint_vertice_comparison, pgr_dijkstra(" +
    "'SELECT pk as id, source, target, costs as cost, reverse_costs as reverse_cost FROM current.merged_ways', " +
     dif_verticeid + ", (select array_agg(id::integer) as array " +
"from current.samplepoint_vertice_comparison), TRUE) where current.samplepoint_vertice_comparison.id = end_vid order by end_vid, agg_cost desc), " +
"o as( SELECT DISTINCT ON (end_vid) *, agg_cost/60 as fur_cost_m, samplepoint_vertice_comparison.geom as pointgeom " +
"FROM future.samplepoint_vertice_comparison, pgr_dijkstra('SELECT pk as id, source, target, costs as cost, reverse_costs as reverse_cost FROM future.merged_ways', " +
     dif_fur_verticeid + ", (select array_agg(id::integer) as array from future.samplepoint_vertice_comparison), TRUE) " +
             "where future.samplepoint_vertice_comparison.id = end_vid order by end_vid, agg_cost desc) " +
"SELECT (i.cost_m-o.fur_cost_m) as cost_m, st_asgeojson(grid2.geom, 4326) as geojson from i, o, grid2 " +
"where st_intersects(i.pointgeom, grid2.geom) AND st_intersects(o.pointgeom, i.pointgeom);", function (difminutemapdata) {
                        console.log(difminutemapdata);
                        difminutemaoutput = difminutemapdata;

                    }
        )
            ).then (succes, difminutemapfail2)
        };

    function difminutemapfail2() {console.log("Difference minute map failed to query")};

   function succes() {
                // control that shows state info on hover
    info = L.control({position: 'topleft'});

	info.onAdd = function (mymap) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};


// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Future improvement: </h4>' +  (props ?
        '<b>' + props.cost_m + ' minutes </b>'
        : 'Hover over a hexagon');
	};

	info.addTo(mymap);

            function getColor(d) {
                return  d > 11 ? '#005a32' :
                        d > 10 ? '#116F3A' :
                        d > 9 ? '#41AB5D' :
                        d > 8 ? '#54B36D' :
                        d > 7 ? '#67BB7D' :
                        d > 6 ? '#7AC48D' :
                        d > 5 ? '#8DCC9D' :
                        d > 4 ? '#A0D5AE' :
                        d > 3 ? '#B3DDBE' :
                        d > 2 ? '#C6E5CE' :
                        d > 1 ? '#D9EEDE' :
                        d > 0 ? '#FFFFFF' :
                                 '#FFFFFF';

            }

            function style(feature) {
                return {
                    fillColor: getColor(feature.properties.cost_m),
                    weight: 0.5,
                    opacity: 4,
                    color: 'black',
                    fillOpacity: 0.85
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
            difminutemaoutput.resetStyle(e.target);
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


    difminutemaoutput = new L.GeoJSON(difminutemaoutput, {
        style: style,
        onEachFeature: onEachFeature
    });

layerGroup3.addLayer(difminutemaoutput);

            };


