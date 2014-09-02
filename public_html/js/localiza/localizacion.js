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
    $(".infoTerritorial").css("display", "none");


    $('#parroquiaCombo').attr("disabled", true);

//    $('#bntConsultaT').prop("disabled", true);

    $('input[type="submit"]').attr('disabled', 'disabled');

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

    $("#miMapa").css("display", "none");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {




            function ViewModelSector() {
                var self = this;

                self.regiones = ko.observableArray();
                self.provincias = ko.observableArray();
                self.cantones = ko.observableArray();
                self.parroquias = ko.observableArray();

                self.regionSeleccionada = ko.observable();
                self.provinciaSeleccionada = ko.observable();
                self.cantonSeleccionado = ko.observable();
                self.parrSeleccionada = ko.observable();


                self.parr = ko.observableArray();
             

                //variables para consulta de busqueda
                var auxProvincia;
                var auxCanton;
                var auxParroquia;
                var banderaParroquia;


                var ipserver;
                $.ajax({
                    url: "cadena.txt",
                    dataType: "text",
                    success: function(data) {
                        ipserver = data;
                        var cadena = ipserver + "/ServicioWeb/webresources/indregion/";

                        $.getJSON(cadena, function(result) {
                            $.each(result, function() {
                                self.regiones.push({
                                    serialReg: this.serialReg,
                                    nombreReg: this.nombreReg
                                });

                            });
                        });

                    }
                });


                self.regionSeleccionada.subscribe(function(serialRegion) {
                    self.provincias([]);
                    $('#parroquiaCombo').attr("disabled", true);
                    $('input[type="submit"]').attr('disabled', 'disabled');
                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            var cadena = ipserver + "/ServicioWeb/webresources/indprovincia/" + serialRegion;

                            $.getJSON(cadena, function(result) {
                                $.each(result, function() {
                                    self.provincias.push({
                                        serialPrv: this.serialPrv,
                                        nombrePrv: this.nombrePrv
                                    });

                                });
                            });

                        }
                    });

                });

                self.provinciaSeleccionada.subscribe(function(serialProvincia) {
                    self.cantones([]);

                    $('#parroquiaCombo').attr("disabled", true);
                    $('input[type="submit"]').attr('disabled', 'disabled');
                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            var cadena = ipserver + "/ServicioWeb/webresources/indcanton/" + serialProvincia;

                            $.getJSON(cadena, function(result) {

                                auxProvincia = result[0].serialPrv.codigotPrv;

                                $.each(result, function() {
                                    self.cantones.push({
                                        serialCiu: this.serialCiu,
                                        nombreCiu: this.nombreCiu
                                    });

                                });
                            });

                        }
                    });

                });

                self.cantonSeleccionado.subscribe(function(serialCanton) {
                    self.parroquias([]);

                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            var cadena = ipserver + "/ServicioWeb/webresources/indparroquia/" + serialCanton;

                            $.getJSON(cadena, function(result) {
                                auxCanton = result[0].codigotPar.substring(0, 4);
                                banderaParroquia = "cnsT2.html?" + auxProvincia + "&" + auxCanton;
                                $('#parroquiaCombo').attr("disabled", false);
                                $('input[type="submit"]').removeAttr('disabled');
                                $.each(result, function() {
                                    self.parroquias.push({
                                        serialPar: this.serialPar,
                                        nombrePar: this.nombrePar
                                    });

                                });
                            });

                        }
                    });

                });

                self.parrSeleccionada.subscribe(function(serialParroquia) {
                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            var cadena = ipserver + "/ServicioWeb/webresources/indparroquia/par/" + serialParroquia;

                            $.getJSON(cadena, function(result) {
                                auxParroquia = result.codigotPar;
                                banderaParroquia = "cnsT3.html?" + auxProvincia + "&" + auxCanton + "&" + auxParroquia;
                            });

                        }
                    });


                });


                self.redirigir = function() {

                    location.href = banderaParroquia;


                };


                var nombre_prv;
                var nombre_ciu;
                var codigo_prv;
                var codigo_ciu;
                var codigo_par;



                $.ajax({
                    url: "cadenaMapa.txt",
                    dataType: "text",
                    success: function(data) {
                        ipserver = data;
                        var cadena = ipserver + "/WSMapas/webresources/territorial/3/" + lng + "/" + lat;

                        $.getJSON(cadena, function(result) {

                            $(".loadingPag").css("display", "none");
                            $(".infoTerritorial").css("display", "block");
                            $("#miMapa").css("display", "block");
                            var objeto = result[0];
                            $("#provincia").html(objeto[5]);
                            $("#canton").html(objeto[3]);
                            codigo_prv = objeto[4];
                            codigo_ciu = objeto[2];
                            codigo_par = objeto[0];

                            nombre_prv = objeto[5];
                            nombre_ciu = objeto[3];
                            //                Consulta de altura y superficie

                            $.ajax({
                                url: "cadena.txt",
                                dataType: "text",
                                success: function(data) {
                                    ipserver = data;
                                    var cadena = ipserver + "/ServicioWeb/webresources/territorial/consultaDPA/" + codigo_prv + "/" + codigo_ciu;

                                    $.getJSON(cadena, function(result) {

                                        var provincia = result[0];
                                        var canton = result[1];
                                        $("#per_Prv").html(provincia.per);
                                        $("#per_Ciu").html(canton.per);
                                        $("#pobU_Prv").html(provincia.perUrbana);
                                        $("#pobU_Ciu").html(canton.perUrbana);
                                        $("#pobR_Prv").html(provincia.perRural);
                                        $("#pobR_Ciu").html(canton.perRural);
                                        $("#super_Prv").html(provincia.superficie);
                                        $("#super_Ciu").html(canton.superficie);
                                        $("#alt_Prv").html(provincia.alturaMedia);
                                        $("#alt_Ciu").html(canton.alturaMedia);
                                        $("#den_Prv").html(provincia.densidadPoblacional);
                                        $("#den_Ciu").html(canton.densidadPoblacional);
                                        $("#prv_per02").html(provincia.per02);
                                        $("#ciu_per02").html(canton.per02);
                                        $("#prv_per35").html(provincia.per35);
                                        $("#ciu_per35").html(canton.per35);
                                        $("#prv_per617").html(provincia.per617);
                                        $("#ciu_per617").html(canton.per617);
                                        $("#prv_per1829").html(provincia.per1829);
                                        $("#ciu_per1829").html(canton.per1829);
                                        $("#prv_per3064").html(provincia.per3064);
                                        $("#ciu_per3064").html(canton.per3064);
                                        $("#prv_per65").html(provincia.per65);
                                        $("#ciu_per65").html(canton.per65);
                                        $("#prv_perpobreza").html(provincia.perPobreza);
                                        $("#ciu_perpobreza").html(canton.perPobreza);
                                        $("#prv_analfa15").html(provincia.analfa15);
                                        $("#ciu_analfa15").html(canton.analfa15);
                                        $("#prv_escola24").html(provincia.escola24);
                                        $("#ciu_escola24").html(canton.escola24);
                                        $("#prv_hacinaHogares").html(provincia.hacinaHogares);
                                        $("#ciu_hacinaHogares").html(canton.hacinaHogares);

                                        $.ajax({
                                            url: "cadena.txt",
                                            dataType: "text",
                                            success: function(data) {
                                                ipserver = data;
                                                var cadena = ipserver + "/ServicioWeb/webresources/territorial/" + codigo_prv + "/" + codigo_ciu + "/" + canton.per;
                                                $.getJSON(cadena, function(result) {

                                                    $.each(result, function() {
                                                        self.parr.push({
                                                            nombreParr: this.nombreParroquia,
                                                            valorParr: this.perPorParroquia
                                                        });
                                                    });
                                                });
                                            }
                                        });
                                        $.ajax({
                                            url: "cadena.txt",
                                            dataType: "text",
                                            success: function(data) {
                                                ipserver = data;
                                                var cadena = ipserver + "/ServicioWeb/webresources/territorial/distrito/" + codigo_prv;
                                                $.getJSON(cadena, function(result) {
                                                   
                                                    $.each(result, function() {
                                                         var codDistrito = this.codigotDistrito;
                                                        var auxObjetos = "<li>"
                                                                + "<table><thead><tr><th>Distrito</th><th>Cantón</th><th>Personas</th></tr></thead>"
                                                                + "<tbody>";
                                                        var lista = this.datosCanton;
                                                        var auxTabla = " ";
                                                        var cont = 0;
                                                        $.each(lista, function() {
                                                             cont = cont + 1;
                                                             if (cont === 1){
                                                                 
                                                                  auxTabla = auxTabla 
                                                                    + "<tr><td style='text-align: right;  width: 33%;'>" + codDistrito + "</td>"
                                                                    + "<td style='text-align: right; width: 33%;'>" + this.nombreCanton + "</td>"
                                                                    + "<td style='text-align: right; width: 33%;'>" + this.personas + "</td></tr>";
                                                             }else{
                                                                 
                                                                  auxTabla = auxTabla 
                                                                    + "<tr><td style='text-align: right; width: 33%;'>"+"  "+"</td>"
                                                                    + "<td style='text-align: right; width: 33%;'>" + this.nombreCanton + "</td>"
                                                                    + "<td style='text-align: right; width: 33%;'>" + this.personas + "</td></tr>";
                                                             }
                                                           
                                                           
                                                            
                                                                   
                                                        });
                                                      
                                                        var final = "</tbody></table></li>";
                                                        var queryTotal = auxObjetos + auxTabla+final;

                                                        $("#listviewSistema").append(queryTotal);
                                                    });

                                                });
                                            }
                                        });

                                        $('#container1').highcharts({
                                            chart: {
                                                type: 'column'
                                            },
                                            title: {
                                                text: 'Tipologia de viviendas totales'
                                            },
                                            credits: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                categories: [nombre_prv, nombre_ciu]

                                            },
                                            yAxis: {
                                                min: 0,
                                                title: {
                                                    text: 'Porcentaje'
                                                }
                                            },
                                            plotOptions: {
                                                column: {
                                                    stacking: 'normal',
                                                    dataLabels: {
                                                        enabled: true,
                                                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                                        style: {
                                                            textShadow: '0 0 3px black, 0 0 3px black'
                                                        }
                                                    }
                                                }
                                            },
                                            series: [{
                                                    name: '% viviendas aceptables',
                                                    data: [parseFloat((provincia.vivAceptable * 100 / provincia.viviendas).toFixed(2)), parseFloat((canton.vivAceptable * 100 / canton.viviendas).toFixed(2))]
                                                }, {
                                                    name: '% viviendas recuperables',
                                                    data: [parseFloat((provincia.vivRecuperable * 100 / provincia.viviendas).toFixed(2)), parseFloat((canton.vivRecuperable * 100 / canton.viviendas).toFixed(2))]
                                                },
                                                {
                                                    name: '% viviendas irrecuperables',
                                                    data: [parseFloat((provincia.vivIrrecuperable * 100 / provincia.viviendas).toFixed(2)), parseFloat((canton.vivIrrecuperable * 100 / canton.viviendas).toFixed(2))]
                                                }]
                                        });



                                        $('#container').highcharts({
                                            chart: {
                                                type: 'column'
                                            },
                                            title: {
                                                text: 'Población urbano/rural'
                                            },
                                            credits: {
                                                enabled: false
                                            },
                                            xAxis: {
                                                categories: [nombre_prv, nombre_ciu]

                                            },
                                            yAxis: {
                                                min: 0,
                                                title: {
                                                    text: 'Porcentaje'
                                                }
                                            },
                                            plotOptions: {
                                                column: {
                                                    stacking: 'normal',
                                                    dataLabels: {
                                                        enabled: true,
                                                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                                                        style: {
                                                            textShadow: '0 0 3px black, 0 0 3px black'
                                                        }
                                                    }
                                                }
                                            },
                                            series: [{
                                                    name: '% población urbana',
                                                    data: [parseFloat((provincia.perUrbana * 100 / provincia.per).toFixed(2)), parseFloat((canton.perUrbana * 100 / canton.per).toFixed(2))]
                                                }, {
                                                    name: '% población rural',
                                                    data: [parseFloat((provincia.perRural * 100 / provincia.per).toFixed(2)), parseFloat((canton.perRural * 100 / canton.per).toFixed(2))]
                                                }]
                                        });


                                    });
                                }

                            });

                        });
                    }
                });

            }
// Activamos knockout.js
            ko.applyBindings(new ViewModelSector());



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



        });



    }
}

