/**
 * Created by skodmunk on 16/06/2017.
 */
      //Global Variables created for later use in functions.
    var coordinates;
    var adressedata;
    var adress;
	var adress2;
    var destination;
    var commute;
    var sumdistance;
    var verticeid;
    var minutemapdata;
    var info;
    var minutemap2leaflet;
    var difmap;
    var difdata;
    //highlight/mouseover test
    var geojson;
  //  var pgrouting2leaflet2;

    	//Variables containing custom markers based on the "AwesomeMarkers" library.
    var redMarker = new L.AwesomeMarkers.icon({
        icon: 'home',
        prefix: 'fa',
        markerColor: '#e01e04'
    });
    var darkblueMarker = new L.AwesomeMarkers.icon({
        icon: 'train',
        prefix: 'fa',
        markerColor: 'darkblue'
    });
    var blueMarker = new L.AwesomeMarkers.icon({
        icon: 'home',
        prefix: 'fa',
        markerColor: 'blue'
    });
    //initialize the map and set its view to chosen geographical coordinates and zoom level
    var mymap = L.map('mapid').setView([55.676, 12.568],12);
    //adds markers and geojson datapoints to a group - used for refreshing/clearing already loaded data
    var layerGroup = L.layerGroup();
    layerGroup.addTo(mymap);
    //adds commute pgrouting to a seperate layergroup for seperate refreshing of already loaded data
    var layerGroup2 = L.layerGroup();
    layerGroup2.addTo(mymap);
    //Minutemap layergroup
    var layerGroup3 = L.layerGroup();
    layerGroup3.addTo(mymap);
    //difference layergroup
    var layerGroup4 = L.layerGroup();
    layerGroup4.addTo(mymap);



    //load a tile layer Mapbox Streets tile layer
     var mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery � <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 20,
        id:'clarineo.23o81n9e',
        accessToken:'pk.eyJ1IjoiY2xhcmluZW8iLCJhIjoiY2l2aDJocjZ0MDA1ajJvb3djeTdidWxyaSJ9.HVE2DplZgfv5T4FSUqah7A'
    }).addTo(mymap);

//Layercontrol:
    var baseMaps = {
    "Mapbox": mapbox
};

    var overlayMaps = {
    "Origin": layerGroup,
    "Routes/Destination": layerGroup2,
    "Minutemap": layerGroup3,
    "Avg improvement map": layerGroup4
    };

    L.control.layers(baseMaps, overlayMaps, {position: 'topleft'}).addTo(mymap);

    //Sidebar creation and settings.
    var sidebar = L.control.sidebar('sidebar', {position: 'right'}).addTo(mymap);
        //Autocomplete search function
    $('#adgangsadresse-autocomplete').dawaautocomplete({
        baseUrl: 'http://dawa.aws.dk',
        minLength: 1,
        adgangsadresserOnly: true,
        params: {kommunekode: 101||147},
        // This function is called when the user chooses an address.
        select: function(event, input) {
            adress = input.tekst;
			adress2 = "'" + input.tekst + "'";
			console.log(adress2);

        },
        // This function is called upon if an error occurs: NOTE, NO FUNCTION AT THE MOMENT!
        error: function(xhr, status, error) {

        }
    });

        //Autocomplete search function
    $('#adgangsadresse-autocomplete2').dawaautocomplete({
        baseUrl: 'http://dawa.aws.dk',
        minLength: 1,
        adgangsadresserOnly: true,
        params: {kommunekode: 101},
        // This function is called when the user chooses an address.
        select: function(event, input) {
            commute = "'" + input.tekst + "'";
            console.log(commute);

        }
    });