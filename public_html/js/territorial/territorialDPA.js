//$(function() {
//    //single Option with an Observable amount
//
//    function Parroquia(nombreParroquia) {
//        var self = this;
//        self.nombreParroquia = nombreParroquia;
//      
//    }
//
//    //single Product containing an Observable Array of Options (that contain Observable data)
//
// function Canton(nombreCanton, parroquias) {
//        var self = this;
//        self.nombreCanton = ko.observable(nombreCanton);
//        self.parroquias = ko.observableArray(ko.utils.arrayMap(parroquias, function(parroquia) {
//            return new Parroquia(parroquia.nombreParroquia);
//        }));
//    }
//
//
//    function Provincia(nombreProvincia, cantones) {
//        var self = this;
//        self.nombreProvincia = ko.observable(nombreProvincia);
//        self.cantones = ko.observableArray(ko.utils.arrayMap(cantones, function(canton) {
//            return new Canton(canton.nombreCanton, canton.parroquias);
//        }));
//    }
//
//    //single Category containing an Observable Array of Products (that contain Observable Arrays with Observable data)
//
//    function Region(nombreRegion, provincias) {
//        var self = this;
//        self.nombreRegion = nombreRegion;
//        self.provincias = ko.observableArray(ko.utils.arrayMap(provincias, function(provincia) {
//            return new Provincia(provincia.nombreProvincia, provincia.cantones);
//        }));
//    }
//
//    //single Menu containing an Observable Array of Categories (that contain Observable Arrays with Observable data)
//
//    function Menu(dpa) {
//        var self = this;
//        self.dpa = ko.observableArray(ko.utils.arrayMap(dpa, function(region) {
//            return new Region(region.nombreRegion, region.provincias);
//        }));
//
//
//    }
//
//   
//
//
//
//    // Overall viewmodel for this screen, along with initial state
//
//    function ViewModel(menus) {
//        var self = this;
//    self.region = ko.observable();
//    self.product = ko.observable();
//        self.dpa = ko.observableArray(ko.utils.arrayMap(menus, function(region) {
//            return new Region(region.nombreRegion, region.provincias);
//        }));
//
//    }
//    ko.applyBindings(new ViewModel(data));
//
//});
//
//var data = [{
//        "dpa": [
//            {
//                "nombreRegion": "Costa",
//                "provincias": [{
//                        "nombreProvincia": "El Oro",
//                        "cantones": [
//                            {
//                                "nombreCanton": "Machala",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "El Retiro"
//                                    },
//                                    {
//                                        "nombreParroquia": "Machala"
//                                    }
//                                ]
//                            },
//                            {
//                                "nombreCanton": "Arenillas",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "Chacras"
//                                    },
//                                    {
//                                        "nombreParroquia": "Palmales"
//                                    }
//                                ]
//                            }
//                        ]},
//                    {
//                        "nombreProvincia": "Emeraldas",
//                        "cantones": [
//                            {
//                                "nombreCanton": "Esmeraldas",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "Tachina"
//                                    },
//                                    {
//                                        "nombreParroquia": "Chinca"
//                                    }
//                                ]
//                            },
//                            {
//                                 "nombreCanton": "Eloy Alfaro",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "Valdéz (Limones limones limones) "
//                                    },
//                                    {
//                                        "nombreParroquia": "La Tola"
//                                    }
//                                ]
//                            }
//                        ]}
//                ]},
//            {
//                "nombreRegion": "Sierra",
//                "provincias": [
//                    {
//                        "nombreProvincia": "Azuay",
//                        "cantones": [
//                            {
//                                 "nombreCanton": "Cuenca",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "Sinincay"
//                                    },
//                                    {
//                                        "nombreParroquia": "Turi"
//                                    }
//                                ]
//                            },
//                            {
//                                "nombreCanton": "Giron",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "San Gerardo"
//                                    },
//                                    {
//                                        "nombreParroquia": "Giron"
//                                    }
//                                ]
//                            
//                            }
//                        ]
//                    },
//                    {
//                        "nombreProvincia": "Bolivar",
//                        "cantones": [
//                            {
//                                "nombreCanton": "Guaranda",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "Salinas"
//                                    },
//                                    {
//                                        "nombreParroquia": "Guaranda"
//                                    }
//                                ]
//                            
//                            },
//                            {
//                                "nombreCanton": "Chimbo",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "San Jose"
//                                    },
//                                    {
//                                        "nombreParroquia": "San Sebastian"
//                                    }
//                                ]
//                            }
//                        ]}
//                ]},
//            {
//                "nombreRegion": "Amazonía",
//                "provincias": [
//                    {
//                        "nombreProvincia": "Napo",
//                        "cantones": [
//                            {
//                                "nombreCanton": "Tena",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "Pano"
//                                    },
//                                    {
//                                        "nombreParroquia": "Tena"
//                                    }
//                                ]
//                            },
//                            {
//                               "nombreCanton": "Archidona",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "Archidona"
//                                    },
//                                    {
//                                        "nombreParroquia": "Cotundo"
//                                    }
//                                ]
//                            }
//                        ]},
//                    {
//                        "nombreProvincia": "Pastaza",
//                        "cantones": [
//                            {
//                               "nombreCanton": "Pastaza",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "Puyo"
//                                    },
//                                    {
//                                        "nombreParroquia": "Pomona"
//                                    }
//                                ]
//                            },
//                            {
//                                "nombreCanton": "Mera",
//                                "parroquias": [
//                                    {
//                                        "nombreParroquia": "Shell"
//                                    },
//                                    {
//                                        "nombreParroquia": "Mera"
//                                    }
//                                ]
//                            }
//                        ]}
//                ]}
//        ]}];

var viewModel = function(){
    var self = this;
    self.makes = ko.observableArray();
    self.makes = [
        {id: 1, name: 'Ford'},
        {id:2, name: 'Audi'}
    ];
 
    self.types = [
        {id: 1, make:1, name:'Truck'},
        {id: 2, make:1, name:'Car'},
        {id: 3, make:2, name:'Crossover'},
        {id: 4, make:2, name:'Car'}
    ];
 
    self.models = [
        {id:1, make:1,type: 1, name: 'F150'},
        {id: 2, make:1,type: 1, name: 'Superduty'},
        {id: 3, make:1,type: 2, name: 'Focus'},
        {id: 4, make:1,type: 2, name: 'Mustang'},
        {id: 5, make:2,type: 3, name: 'Q5'},
        {id: 6, make:2,type: 3, name: 'Q7'},
        {id: 7, make:2,type: 4, name: 'A3'},
        {id: 8, make:2,type: 4, name: 'A4'},
        {id: 9, make:2,type: 3, name: 'A6'}
    ];
 
    self.selectedMake = ko.observable();
    self.selectedType = ko.observable();
    self.selectedModel = ko.observable();
    
      
 
    self.carTypes = ko.computed(function(){
        return ko.utils.arrayFilter(self.types, function(item){
            return item.make === self.selectedMake();
        });
    });
    
     self.carModels = ko.computed(function(){
        return ko.utils.arrayFilter(self.models, function(item){
            return item.make === self.selectedMake() && item.type === self.selectedType();
        });
    });

 
};

var model = new viewModel();


ko.applyBindings(model);