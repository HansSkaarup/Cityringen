/**
 * Created by skodmunk on 16/06/2017.
 */
//MASTER FUNCTION - Finds id and .then to the rest of minutemap chain:
         function differencemap() {
    //Refreshes/Clears minutemap.

    if (typeof info !== 'undefined') {
        mymap.removeControl(info);
    }

    //.when and getJSON
    $.when($.getJSON('php/difference.php?dif=' + "a", function (differencedata) {
            console.log(differencedata);
            difdata = differencedata;

        })
    ).then(visualizedifferencemap, differencemapfailed)
};

    function differencemapfailed() {Console.log("differencemap data load failed")};

    function visualizedifferencemap() {
                // control that shows state info on hover
    info = L.control({position: 'topleft'});

	info.onAdd = function (mymap) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};


// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Average improvement: </h4>' +  (props ?
        '<b>' + props.avg_cost + ' minutes </b>'
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
                        d > 0.6 ? '#ffffcc' :
                        d > 0.5 ? '#d9f0a3' :
                        d > 0.4 ? '#addd8e' :
                        d > 0.3 ? '#41ab5d' :
                        d > 0.2 ? '#238443' :
                        d > 0.1 ? '#005a32' :
                                 '#FFEDA0';

            }

            function style(feature) {
                return {
                    fillColor: getColor(feature.properties.avg_cost),
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
            difmap.resetStyle(e.target);
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


    difmap = new L.GeoJSON(difdata, {
        style: style,
        onEachFeature: onEachFeature
    });

layerGroup4.addLayer(difmap);

            };

