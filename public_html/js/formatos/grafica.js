


function ViewModelGrafica() {
    var principal = this;
    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        nombreIndicador = elem[0];
        serialGrupo = elem[1];
        serialSistema = elem[2];
    }
    $(".loadingPag").css("display", "block");
    $("#divFuente").css("display", "none");
    var cadena = "";
    principal.ejemploLista = ko.observableArray();
    principal.fichaList = ko.observableArray();


    var ipserver;
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
            cadena = ipserver + "/ServicioWeb/webresources/grafico/RLV/" + serialGrupo + "/" + nombreIndicador;

            $.getJSON(cadena, function(result) {
                $(".loadingPag").css("display", "none");
                for (var j = 0; j < 1; j++) {
                    principal.fichaList.push({
                        url: ko.observable("ficha.html?" + result.path_indicador),
                        details: ko.observable(""),
                        textoBoton: ko.observable("Ver ficha")
                    });
                }


//
//                //Se hace visible la tabla
                $("#tblCabecera").css("display", "block");
                $("#pageNavPosition").css("display", "block");
                $("#results").css("display", "block");
//
////hace invisible la fuente y el anio
                $("#divFuente").css("display", "block");
                $('#ficha').html(result.definicion_grafica);

                $("#lblFuente").html(result.fuente_indicador);
                $("#lblAnio").html(result.anio_indicador);
                var i;

                for (var i = 0; i < result.valoresY_indicador.length; i++) {
                    var datoR = result.valoresY_indicador[i].data;
                    // var listaP = datoR.data.split(',');
                    principal.ejemploLista.push({
                        dato1: result.valoresY_indicador[i].name,
                        dato2: "",
                        dato3: ""


                    });
                    for (var j = 0; j < datoR.length; j++) {
                        
                         if (result.tooltip_indicador !== null)
                        {
                            principal.ejemploLista.push({
                            dato1: "",
                            dato2: result.valoresX_indicador[j],
                            dato3: datoR[j] + " " + result.tooltip_indicador
                        });
                            
                        }
                        else{
                           principal.ejemploLista.push({
                            dato1: "",
                            dato2: result.valoresX_indicador[j],
                            dato3: datoR[j]  });
                            
                        }
                        
                        
                    }
                }

                pager = new Pager('results', result.valoresX_indicador.length + 1);
                pager.init();
                pager.showPageNav('pager', 'pageNavPosition');
                pager.showPage(1);

//Los valores que se necesitan son arrays
                var valoresX = result.valoresX_indicador;

                $('#container').highcharts({
                    //Type spline: suaviza las curvas
                    chart: {
                        type: 'spline'
               
                   
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
                        },
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
                    },
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
                $(".loadingPag").css("display", "none");
                $("#errorGrafico").css("display", "block");
                $(".errorGrafico").html("Al momento no se puede mostrar la informacion");
                $(".tab-links").css("display", "none");

            });
        }
    });
}
// Activamos knockout.js
ko.applyBindings(new ViewModelGrafica());





