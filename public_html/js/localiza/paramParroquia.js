/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
//function ViewModelGrafica() {

var mapa;
var lat = null;
var lng = null;
var cadena = "";
var estiloProvincia;
var provPA;
var cantPA;
function init() {


    mapa = new OpenLayers.Map("miMapa");

    var layerBase = new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            "http://201.219.3.196:8079/geoserver/wms?service=WMS",
            {
                layers: "siise:parr_00"
            }
    );
    mapa.addLayer(layerBase);

    $("#miMapa").css("display", "none");


    function ViewModelSector() {

        if (location.search.substr(1)) {
            Variable = location.search.substr(1);
            var elem = Variable.split('&');
            provincia = elem[0];
            canton = elem[1];
            parroquia = elem[2];
        }

        $(".loadingPag").css("display", "block");
        $(".infoTerritorial").css("display", "none");
        $('#parroquiaCombo').attr("disabled", true);
        $('input[type="submit"]').attr('disabled', 'disabled');

        var self = this;
        self.fichaList = ko.observableArray();
        self.regiones = ko.observableArray();
        self.provincias = ko.observableArray();
        self.cantones = ko.observableArray();
        self.parroquias = ko.observableArray();

        self.regionSeleccionada = ko.observable();
        self.provinciaSeleccionada = ko.observable();
        self.cantonSeleccionado = ko.observable();
        self.parrSeleccionada = ko.observable();


        self.parr = ko.observableArray();

        var ipserver;

        //variables para consulta de busqueda
        var auxProvincia;
        var auxCanton;
        var auxParroquia;
        var banderaParroquia;


//Consulta las regiones
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
        //Carga las provincias segun la region
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
        //Carga los cantones por provincia
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
        //Carga las parroquias por canton
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
        //Consulta la parroquia segun ID
        self.parrSeleccionada.subscribe(function(serialParroquia) {
            $.ajax({
                url: "cadena.txt",
                dataType: "text",
                success: function(data) {
                    ipserver = data;
                    var cadena = ipserver + "/ServicioWeb/webresources/indparroquia/par/" + serialParroquia;

                    $.getJSON(cadena, function(result) {
                        auxParroquia = result.codigotPar;
                        banderaParroquia = "cnsT2.html?" + auxProvincia + "&" + auxCanton + "&" + auxParroquia;
                    });

                }
            });


        });
//Boton redirigir
        self.redirigir = function() {

            location.href = banderaParroquia;

//                        alert("aqui: " + auxProvincia + "-" + auxCanton + "-" + auxParroquia);
        };




        var nombre_prv;
        var nombre_ciu;
        var nombre_par;
        var codigo_prv;
        var codigo_ciu;
        var codigo_par;



        $.ajax({
            url: "cadenaMapa.txt",
            dataType: "text",
            success: function(data) {
                ipserver = data;
                var cadena = ipserver + "/WSMapas/webresources/territorial/parr/" + provincia + "/" + canton + "/" + parroquia;

                $.getJSON(cadena, function(result) {
                    var consulta = result[0];
                    //split
                    var char = consulta[6].split("(");

                    var coordenadas = char[1].split(")");
                    var latlng = coordenadas[0].split(" ");
                    lng = latlng[0];
                    lat = latlng[1];
                    var lnglat = new OpenLayers.LonLat(lng, lat).transform(
                            new OpenLayers.Projection("EPSG:4326"),
                            mapa.getProjectionObject());
                    mapa.setCenter(lnglat, 11);


                    var markers = new OpenLayers.Layer.Markers("Marcas");
                    mapa.addLayer(markers);

                    var size = new OpenLayers.Size(21, 25);
                    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
                    var icon = new OpenLayers.Icon('puntero.png', size, offset);


                    markers.addMarker(new OpenLayers.Marker(lnglat, icon));

                    $(".loadingPag").css("display", "none");
                    $(".infoTerritorial").css("display", "block");
                    $("#miMapa").css("display", "block");

                    $("#canton").html(consulta[1]);
                    $("#parroquia").html(consulta[4]);
                    codigo_prv = consulta[2];
                    codigo_ciu = consulta[0];
                    codigo_par = consulta[5];
                    nombre_ciu = consulta[1];
                    nombre_par = consulta[4];

                    //                Consulta de altura y superficie


                    $.ajax({
                        url: "cadena.txt",
                        dataType: "text",
                        success: function(data) {
                            ipserver = data;
                            var cadena = ipserver + "/ServicioWeb/webresources/territorial/consultaDPA/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;

                            $.getJSON(cadena, function(result) {

                                var parroquia = result[2];
                                var canton = result[1];
                                $("#per_Par").html(parroquia.per);
                                $("#per_Ciu").html(canton.per);
                                $("#pobU_Par").html(parroquia.perUrbana);
                                $("#pobU_Ciu").html(canton.perUrbana);
                                $("#pobR_Par").html(parroquia.perRural);
                                $("#pobR_Ciu").html(canton.perRural);
                                $("#super_Par").html(parroquia.superficie);
                                $("#super_Ciu").html(canton.superficie);
                                $("#alt_Par").html(parroquia.alturaMedia);
                                $("#alt_Ciu").html(canton.alturaMedia);
                                $("#den_Par").html(parroquia.densidadPoblacional);
                                $("#den_Ciu").html(canton.densidadPoblacional);
                                $("#par_per02").html(parroquia.per02);
                                $("#ciu_per02").html(canton.per02);
                                $("#par_per35").html(parroquia.per35);
                                $("#ciu_per35").html(canton.per35);
                                $("#par_per617").html(parroquia.per617);
                                $("#ciu_per617").html(canton.per617);
                                $("#par_per1829").html(parroquia.per1829);
                                $("#ciu_per1829").html(canton.per1829);
                                $("#par_per3064").html(parroquia.per3064);
                                $("#ciu_per3064").html(canton.per3064);
                                $("#par_per65").html(parroquia.per65);
                                $("#ciu_per65").html(canton.per65);
                                $("#par_perpobreza").html(parroquia.perPobreza);
                                $("#ciu_perpobreza").html(canton.perPobreza);
                                $("#par_analfa15").html(parroquia.analfa15);
                                $("#ciu_analfa15").html(canton.analfa15);
                                $("#par_escola24").html(parroquia.escola24);
                                $("#ciu_escola24").html(canton.escola24);
                                $("#par_hacinaHogares").html(parroquia.hacinaHogares);
                                $("#ciu_hacinaHogares").html(canton.hacinaHogares);
                                $.ajax({
                                    url: "cadena.txt",
                                    dataType: "text",
                                    success: function(data) {
                                        ipserver = data;
                                        var cadena = ipserver + "/ServicioWeb/webresources/territorial/distrito/" + codigo_prv + "/" + codigo_ciu + "/" + codigo_par;
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
                                                    if (cont === 1) {

                                                        auxTabla = auxTabla
                                                                + "<tr><td style='text-align: right; width: 27%'>" + codDistrito + "</td>"
                                                                + "<td style='text-align: right; width: 40%'>" + this.nombreCanton + "</td>"
                                                                + "<td style='text-align: right; width: 33%'>" + this.personas + "</td></tr>";
                                                    } else {

                                                        auxTabla = auxTabla
                                                                + "<tr><td style='text-align: right; width: 27%'>" + "  " + "</td>"
                                                                + "<td style='text-align: right; width: 40%'>" + this.nombreCanton + "</td>"
                                                                + "<td style='text-align: right; width: 33%'>" + this.personas + "</td></tr>";
                                                    }




                                                });

                                                var final = "</tbody></table></li>";
                                                var queryTotal = auxObjetos + auxTabla + final;

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
                                        categories: [nombre_ciu, nombre_par]

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
                                            data: [parseFloat((canton.vivAceptable * 100 / canton.viviendas).toFixed(2)), parseFloat((parroquia.vivAceptable * 100 / parroquia.viviendas).toFixed(2))]
                                        }, {
                                            name: '% viviendas recuperables',
                                            data: [parseFloat((canton.vivRecuperable * 100 / canton.viviendas).toFixed(2)), parseFloat((parroquia.vivRecuperable * 100 / parroquia.viviendas).toFixed(2))]
                                        },
                                        {
                                            name: '% viviendas irrecuperables',
                                            data: [parseFloat((canton.vivIrrecuperable * 100 / canton.viviendas).toFixed(2)), parseFloat((parroquia.vivIrrecuperable * 100 / parroquia.viviendas).toFixed(2))]
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
                                        categories: [nombre_ciu, nombre_par]

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
                                            data: [parseFloat((canton.perUrbana * 100 / canton.per).toFixed(2)), parseFloat((parroquia.perUrbana * 100 / parroquia.per).toFixed(2))]
                                        }, {
                                            name: '% población rural',
                                            data: [parseFloat((canton.perRural * 100 / canton.per).toFixed(2)), parseFloat((parroquia.perRural * 100 / parroquia.per).toFixed(2))]
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
}


