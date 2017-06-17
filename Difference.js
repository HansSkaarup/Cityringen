/**
 * Created by skodmunk on 16/06/2017.
 */
//MASTER FUNCTION - Finds id and .then to the rest of minutemap chain:
         function differencemap() {
    //Refreshes/Clears minutemap.
    layerGroup4.clearLayers();

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
//MASTER FUNCTION FUTURE - Finds id and .then to the rest of minutemap chain:
         function daydifferencemap() {
    //Refreshes/Clears minutemap.
    layerGroup4.clearLayers();

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
                return  d > 10 ? '#005a32' :
                        d > 7 ? '#41AB5D' :
                        d > 6 ? '#54B36D' :
                        d > 5 ? '#67BB7D' :
                        d > 4 ? '#7AC48D' :
                        d > 3 ? '#8DCC9D' :
                        d > 2 ? '#A0D5AE' :
                        d > 1 ? '#B3DDBE' :
                        d > 0.5 ? '#C6E5CE' :
                        d > 0.25? '#D9EEDE	' :
                        d > 0 ? '#FFFFFF' :
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

