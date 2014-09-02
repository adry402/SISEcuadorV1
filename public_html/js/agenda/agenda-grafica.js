


function ViewModelGrafica() {
    var principal = this;
    if (location.search.substr(1)) {
        Variable = location.search.substr(1);

        nombreIndicador = Variable;
    }

    var cadena = "";
    principal.ejemploLista = ko.observableArray();
    principal.fichaList = ko.observableArray();

    $(".nombreIndicador").css("display", "none");
    $("#definicion").css("display", "none");

    $("#errorGrafico").css("display", "none");
    //Se hace visible la tabla
    $("#tblCabecera").css("display", "none");
    $("#pageNavPosition").css("display", "none");
    $("#results").css("display", "none");

//
////hace invisible la fuente y el anio
    $("#divFuente").css("display", "none");
    var ipserver;
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
            cadena = ipserver + "/ServicioWeb/webresources/grafico/" + nombreIndicador;

            $.getJSON(cadena, function(result) {

                for (var j = 0; j < 1; j++) {
                    principal.fichaList.push({
                        url: ko.observable("ficha.html?" + result.path_indicador),
                        details: ko.observable(""),
                        textoBoton: ko.observable("Ver ficha")
                    });
                }
                $(".nombreIndicador").css("display", "block");
                $(".nombreIndicador").html(result.nombre_indicador);

                $(".loadingPag").css("display", "none");

 $("#definicion").css("display", "block");
//                $("#footerGrafico").css("display", "block");
////
////                //Se hace visible la tabla
                $("#tblCabecera").css("display", "block");
                $("#pageNavPosition").css("display", "block");
                $("#results").css("display", "block");
////
//////hace invisible la fuente y el anio
                $("#divFuente").css("display", "block");
//                
//
                $('#ficha').html(result.definicion_grafica);
                $("#lblFuente").html(result.fuente_indicador);
                $("#lblAnio").html(result.anio_indicador);
                var i;
                var itemPorHoja = 0;
                var serieName = result.valoresY_indicador[0].name;
                for (var i = 0; i < result.valoresY_indicador.length; i++) {
                    var serieName1 = result.valoresY_indicador[i].name;
                    var datoR = result.valoresY_indicador[i].data;
                    // var listaP = datoR.data.split(',');
                    principal.ejemploLista.push({
                        dato1: result.valoresY_indicador[i].name,
                        dato2: "",
                        dato3: ""
                    });
                    for (var j = 0; j < datoR.length; j++) {

                        if (datoR[j] !== null)
                        {
                            if (result.valoresX_indicador[j] === "2017") {

                                principal.ejemploLista.push({
                                    dato1: "",
                                    dato2: result.valoresX_indicador[j] + "- meta",
                                    dato3: datoR[j] + " " + result.tooltip_indicador

                                });


                            } else {

                                principal.ejemploLista.push({
                                    dato1: "",
                                    dato2: result.valoresX_indicador[j],
                                    dato3: datoR[j] + " " + result.tooltip_indicador
                                });
                                if (serieName === serieName1)
                                    itemPorHoja = itemPorHoja + 1;
                            }
                        }
                    }
                }

                pager = new Pager('results', itemPorHoja + 2);
                pager.init();
                pager.showPageNav('pager', 'pageNavPosition');
                pager.showPage(1);

//Los valores que se necesitan son arrays
                var valoresX = result.valoresX_indicador;

                $('#container').highcharts({
                    //Type spline: suaviza las curvas
                    chart: {
                        type: result.tipo_grafica
                    },
                    title: {
                        text: result.nombre_indicador,
                        align: 'left'
                    },
//            subtitle:{
//                text:'Fuente/Año:' + result.fuente_indicador+"<br>"+result.anio_indicador,
//                x:-20
//            },}
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: valoresX,
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: result.etiquetaX_indicador
                        }
                    },
                    yAxis: {
                        floor: 0,
                        title: {
                            text: result.etiquetaY_indicador
                        },
                        plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }]
                    },
                    tooltip: {
                        valueSuffix: result.tooltip_indicador
                    }
                    ,
                    exporting: {
                        enabled: false}
                    ,
                    series: []
                });
//                Se toma en esta variable
                var chart = $('#container').highcharts();
                for (var i = 0; i < result.valoresY_indicador.length; i++) {
                    var nombre = result.valoresY_indicador[i].name;
                    chart.addSeries({
                        name: nombre,
                        data: result.valoresY_indicador[i].data
                    });
                }
                chart.tooltip.refresh(chart.series[0].data[0]);


            }).error(function() {
                $(".loadingPag").css("display", "block");
                $("#errorGrafico").css("display", "block");
                $("#footerGrafico").css("display", "none");
                $(".errorGrafico").html("Al momento no se puede mostrar la informacion");
            });


        }
    });
}
// Activamos knockout.js
ko.applyBindings(new ViewModelGrafica());





