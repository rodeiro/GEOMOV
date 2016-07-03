var fichero;
var map;
var map2;
var geoJsonRuta;
var puntos = [];
var fechaFinal;
var mapMarkers = [];
var rutaStyle =  {color: "red", weight: 6};
var marcadorInicio;
var marcadorFinal;
var net;


function validarNulo(posibleNulo){

    if((posibleNulo == undefined)||(posibleNulo == null)){
        return "";
    } else{
        return posibleNulo;
    }
}

function checkConnection() {
    var networkState = navigator.connection.type;
 
    if ( networkState == Connection.WIFI){
        net = 2;
                //Por algún motivo en mi dispositivo reconoce el 4G como UNKNOWN
    } else if ((networkState == Connection.UNKNOWN)||(networkState == Connection.CELL_4G)||(networkState == Connection.CELL_3G)||(networkState == Connection.CELL_2G)||(networkState == Connection.CELL)){
        net = 1;
    } else{
        net = 0;
    }

    return net;
}



function onSuccessRuta(position) {

    puntos.push([position.coords.latitude,position.coords.longitude]);
    fechaFinal = Date(Date.now());
    map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 15);
    var lastPoint = L.marker(new L.LatLng(position.coords.latitude, position.coords.longitude));
    map.addLayer(lastPoint);
    mapMarkers.push(lastPoint);
}


function onErrorRuta(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');

    document.getElementById('botonRuta').innerHTML = "Empezar ruta";
}


function manejarContador(){

    var contador = localStorage.getItem("contadorRuta");
    if (contador == null){
        contador = 0;
    }

    localStorage.setItem("contadorRuta", parseInt(contador)+1);
    return contador;
}


function lector(){

    if(!fichero){ 

        alert("Error al leer el fichero"); 

    }else{


        fichero.file(function(e) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                
                var formatoJSON =JSON.parse(evt.target.result);
                geoJsonRuta=  L.geoJson(formatoJSON, {style: rutaStyle});

                map2.addLayer(geoJsonRuta);
                map2.fitBounds(geoJsonRuta.getBounds());
 
                
                //Marcadores
                marcadorInicio = L.marker(new L.LatLng(formatoJSON.geometry.coordinates[0][1],formatoJSON.geometry.coordinates[0][0])).addTo(map2);
                marcadorInicio.bindPopup("<b>Inicio</b><br> "+formatoJSON.properties.inicio ).openPopup();

                marcadorFinal = L.marker(new L.LatLng(formatoJSON.geometry.coordinates[formatoJSON.geometry.coordinates.length-1][1],formatoJSON.geometry.coordinates[formatoJSON.geometry.coordinates.length-1][0])).addTo(map2);
                marcadorFinal.bindPopup("<b>Fin </b>"+formatoJSON.properties.fin+" <br><b>Distancia </b>" + parseFloat(formatoJSON.properties.distancia).toFixed(2)+" km <br><b>Fecha </b>" + formatoJSON.properties.fecha).openPopup();
           
            };
            reader.readAsText(e);
        },function(){
            alert("Error al leer el fichero");
        });    
    }

}


function cambiaLatLon(lista){
    var aux;
     for(var i = 0; i < lista.length; i++){
        aux = lista[i][0];
        lista[i][0] = lista[i][1];
        lista[i][1] = aux;
    }

    return lista;
}

function onDeviceReady() {


    //Peticiones síncronas para completar los datos del archivo en tiempo
    $.ajaxSetup({
        async: false
    });


     document.addEventListener('init', function(event) {
        if(event.target.id=='nuevas'){

            //Mapa
            var stamenTonerLiteLayer = new L.TileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png');
            map = L.map('map');
            map.setView(new L.LatLng(43.50, -8.25), 10);
            map.addLayer(stamenTonerLiteLayer);


            //Botón ruta
            var botonRuta = document.getElementById('botonRuta');
            var watchID;
            var optionsRuta = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

            gdRuta = ons.GestureDetector(botonRuta);
            gdRuta.on('tap', function(evt){
                if(botonRuta.innerHTML == "Detener ruta"){

                    botonRuta.innerHTML = "Empezar ruta";

                    if (watchID != null) {
                        navigator.geolocation.clearWatch(watchID);
                        watchID = null;
                    }

                    console.log(puntos);
                    if(puntos.length>0){ //Controla si el usuario cancela la ruta antes de que se obtuviera ningún punto
                        window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) {
                            var num = manejarContador();                    
                            dir.getFile("varelaTT3_"+num+".json", {create:true}, function(file) {    
                                fichero = file;     

                                fichero.createWriter(function(fileWriter) {
                                    var direccionInicio;
                                    var direccionFin;


                                    $.getJSON('http://nominatim.openstreetmap.org/reverse?format=json&lat='+puntos[0][0]+'&lon='+puntos[0][1]+'&zoom=18&addressdetails=1', function(data) {
                                         direccionInicio = validarNulo(data.address.road)+" "+validarNulo(data.address.house_number)+", "+validarNulo(data.address.city) +", "+validarNulo(data.address.country);
                                         
                                    },function(){ direccionInicio = "Dirección desconocida"});


                                    $.getJSON('http://nominatim.openstreetmap.org/reverse?format=json&lat='+puntos[puntos.length-1][0]+'&lon='+puntos[puntos.length-1][1]+'&zoom=18&addressdetails=1', function(data2) {
                                        direccionFin = validarNulo(data2.address.road)+" "+validarNulo(data2.address.house_number)+", "+validarNulo(data2.address.city) +", "+validarNulo(data2.address.country);
                                        
                                    },function(){ direccionFin = "Dirección desconocida"});

                                    var distanciaRuta = turf.lineDistance(turf.linestring(puntos), 'kilometers');

                                    var linestringJSON = turf.linestring(cambiaLatLon(puntos), {fecha: fechaFinal, distancia: distanciaRuta, inicio: direccionInicio, fin: direccionFin});
                                    var textJSON = JSON.stringify(linestringJSON);
                                        
                                    var blob = new Blob([textJSON], {type:'text/plain'});
                                    fileWriter.write(blob);
                                }, function(){
                                        alert("Error al escribir el archivo");
                                });


                            }, function(){alert("Error");});
                        },function(){alert("Error al localizar directorio");});

                    }
                }else{


                    puntos = [];

                    //Borrar marcadores de la ruta anterior
                    for(var i = 0; i < mapMarkers.length; i++){
                        map.removeLayer(mapMarkers[i]);
                    }

                    if(checkConnection()==0){
                        alert("No dispone de conexión a internet");
                        return;
                    }

                    botonRuta.innerHTML = "Detener ruta";
                    watchID = navigator.geolocation.watchPosition(onSuccessRuta, onErrorRuta, optionsRuta);
                }

            });


            //Botón mapa
            var botonMapa = document.getElementById('botonMapa');
            var mapa = document.getElementById('map');
            mapa.style.display = "none";


            botonMapa.addEventListener("click", function(){


                    if(mapa.style.display == "none"){


                        //Comprobar conexión
                        if(checkConnection()==1){
                            if (confirm("Esta acción puede conllevar consumo elevado de datos") == false) {
                                return;
                            } 
                        }else if(checkConnection()==0){
                            alert("No dispone de conexión a internet");
                            return;
                        }

                        botonMapa.innerHTML = "Ocultar mapa";
                        mapa.style.display = "block";
                    }else{
                        botonMapa.innerHTML = "Ver mapa";
                        mapa.style.display = "none";
                    }



            });

        } // FIN de event.target.id=='nuevas'

        if(event.target.id=='antiguas'){

            //Modificar leaflet para permitir dos popups a la vez
            L.Map = L.Map.extend({
                openPopup: function(popup) {

                    this._popup = popup;

                    return this.addLayer(popup).fire('popupopen', {popup: this._popup});
                }
            }); 

            //El otro mapa
            var osmLayer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
            map2 = L.map('map2');
            map2.addLayer(osmLayer);

            var mapa2 = document.getElementById('map2');
            mapa2.style.display = "none";

            var botonHistorial = document.getElementById('botonHistorial');
            gdHistorial = ons.GestureDetector(botonHistorial);
            gdHistorial.on('tap', function(evt){
            

                //Borrar la ruta anterior de la vista
                if(geoJsonRuta != undefined){
                    map2.removeLayer(geoJsonRuta);
                    map2.removeLayer(marcadorInicio);
                    map2.removeLayer(marcadorFinal);
                }


                //Comprobar conexión
                if(checkConnection()==1){
                    if (confirm("Esta acción puede conllevar consumo elevado de datos") == false) {
                        return;
                    } 

                }else if(checkConnection()==0){
                    alert("No dispone de conexión a internet");
                    return;
                }
                

                window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, function(dir) { 
                    var valor = document.getElementById('idMapa').value;    
                    if((valor=="") || (valor==undefined))  {
                        alert("¡No tengo el id de la ruta!");
                    }else{
                        dir.getFile("varelaTT3_"+valor+".json", {create:false}, function(file) {   
                            fichero = file;     
                            lector();

                            //Mostrar mapa
                            mapa2.style.display = "block";
                        }, function(){alert("Error al abrir el archivo");});
                    }         

                },function(){alert("Error al localizar directorio");});
            });
        }
    });



}


function onload() {  

    document.addEventListener("deviceready", onDeviceReady, false);
  
}
