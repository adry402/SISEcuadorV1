/* 
 * Javascript grafica
 * autor: @Adriana.Romero
 * 
 */

function ViewModelGrafica() {
    var principal = this;
    /*
     * Variables globales y de knockout.js
     * Se recupera las variables responsive
     * @nombreIndicador
     * @serialGrupo
     * @serialSistema
     */

    if (location.search.substr(1)) {
        Variable = location.search.substr(1);
        var elem = Variable.split('&');
        nombreIndicador = elem[0];
        serialGrupo = elem[1];
        serialSistema = elem[2];
    }
    /*
     * Visibilidad de los elementos html
     */

    $(".loadingPag").css("display", "block");
    $("#divFuente").css("display", "none");
    $(".nombreIndicador").css("display", "none");
    /*
     * Variables globales y de knockout.js
     */
    var cadena = "";
    principal.ejemploLista = ko.observableArray();
    principal.fichaList = ko.observableArray();
    var ipserver;

    /*
     *Evento ajax para la grafica
     */
    $.ajax({
        url: "cadena.txt",
        dataType: "text",
        success: function(data) {
            ipserver = data;
            cadena = ipserver + "/ServicioWeb/webresources/grafico/RLV/" + serialGrupo + "/" + nombreIndicador;

            $.getJSON(cadena, function(result) {
                $(".loadingPag").css("display", "none");
                $(".mapaSitio").html(result.subsector_grafica);

                for (var j = 0; j < 1; j++) {
                    principal.fichaList.push({
                        url: ko.observable("ficha.html?" + result.path_indicador),
                        details: ko.observable(""),
                        textoBoton: ko.observable("Ver ficha")
                    });
                }


                $(".nombreIndicador").css("display", "block");
                $("#tblCabecera").css("display", "block");
                $("#pageNavPosition").css("display", "block");
                $("#results").css("display", "block");
                $("#divFuente").css("display", "block");

                $('#ficha').html(result.definicion_grafica);
                $(".lblFuente").html(result.fuente_indicador);
                $(".lblAnio").html(result.anio_indicador);
                $(".nombreIndicador").html(result.nombre_indicador + " (" + result.anio_indicador + ")");
                $("#labelTool").html('&nbsp;' + result.titulo_tablaDatos);
                /**
                 * Función para paginación tabla datos
                 */
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
                                dato3: format(datoR[j], result.numero_decimales)
                            });

                        }
                        else {
                           
                            principal.ejemploLista.push({
                                dato1: "",
                                dato2: result.valoresX_indicador[j],
                                dato3: format(datoR[j], result.numero_decimales)
                            });

                        }

                    }
                }
                /*
                 * Se inicializa la paginación en la tabla de datos
                 */

                pager = new Pager('results', result.valoresX_indicador.length + 1);
                pager.init();
                pager.showPageNav('pager', 'pageNavPosition');
                pager.showPage(1);

                //Los valores que se necesitan son arrays
                var valoresX = result.valoresX_indicador;

                /*
                 * Gráfico en HighCharts
                 */
                $('#container').highcharts({
                    //Type spline: suaviza las curvas
                    chart: {
                        type: 'spline'

                    },
                    title: {
                        text: result.nombre_indicador + " (" + result.anio_indicador + ")",
                        align: 'left'
                    },
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
                        valueSuffix:  ' ' + result.tooltip_indicador
                    }
                    ,
                    exporting: {
                        enabled: false}
                    ,
                    series: []
                });
                // Creación dinámica de series
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
                /*
                 * Se muestra mensaje de error cuando caduca el tiempo de acceso al servidor
                 */
                $(".loadingPag").css("display", "none");
                $("#errorGrafico").css("display", "block");
                $(".errorGrafico").html("Al momento no se puede mostrar la informacion");
                $(".tab-links").css("display", "none");

            });
        }
    });
    /*
     * Funcion separador de miles y decimales
     */
    function format(numero, decimales, separador_decimal, separador_miles) {
        numero = parseFloat(numero);
        if (isNaN(numero)) {
            return "";
        }

        if (decimales !== undefined) {
            // Redondeamos
            numero = numero.toFixed(decimales);
        }

        // Convertimos el punto en separador_decimal
        numero = numero.toString().replace(".", separador_decimal !== undefined ? separador_decimal : ".");
        separador_miles = ",";
        if (separador_miles) {
            // Añadimos los separadores de miles
            var miles = new RegExp("(-?[0-9]+)([0-9]{3})");
            while (miles.test(numero)) {
                numero = numero.replace(miles, "$1" + separador_miles + "$2");
            }
        }

        return numero;
    }
    ;
    function truncator(numToTruncate, intDecimalPlaces) {
        var numPower = Math.pow(10, intDecimalPlaces);
        return ~~(numToTruncate * numPower) / numPower;
    }

}
// Activamos knockout.js
ko.applyBindings(new ViewModelGrafica());
