/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//function ViewModelGrafica() {

var mapa;
var lat;
var lng;
var cadena = "";
var estiloProvincia;
function init() {
    $(".loadingPag").css("display", "block");
//    $("#miMapa").css("display", "none");
    mapa = new OpenLayers.Map("miMapa");

//    var osm = new OpenLayers.Layer.OSM();
//    mapa.addLayer(osm);




    var layerBase = new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            "http://201.219.3.196:8079/geoserver/wms?service=WMS", {
        layers: "siise:cant_00"
    }
    );
    mapa.addLayer(layerBase);
    // mapa.addLayer(osm);
//        mapa.addControl(new OpenLayers.Control.LayerSwitcher(true));
//        mapa.addControl(new OpenLayers.Control.MousePosition({numDigits: 2}));


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {


            lat = position.coords.latitude;
            lng = position.coords.longitude;


//            lng = -80.5893819;
//            lat = -1.0633563;


            var lnglat = new OpenLayers.LonLat(lng, lat).transform(
                    new OpenLayers.Projection("EPSG:4326"),
                    mapa.getProjectionObject());
            mapa.setCenter(lnglat, 9);


            var markers = new OpenLayers.Layer.Markers("Marcas");
            mapa.addLayer(markers);

            var size = new OpenLayers.Size(21, 25);
            var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
            var icon = new OpenLayers.Icon('puntero.png', size, offset);


            markers.addMarker(new OpenLayers.Marker(lnglat, icon));



            function ViewModelSector() {

                var ipserver;
                $.ajax({
                    url: "cadenaMapa.txt",
                    dataType: "text",
                    success: function(data) {
                        ipserver = data;
                        var cadena = ipserver + "/WSMapas/webresources/territorial/3/" + lng + "/" + lat;

                        $.getJSON(cadena, function(result) {
                            $(".loadingPag").css("display", "none");
                            $("#miMapa").css("display", "block");
                            var objeto = result[0];

                            $("#datos").html(objeto[3]);
                        });
                    }
                });


            }
// Activamos knockout.js
            ko.applyBindings(new ViewModelSector());
        });



    }
}


