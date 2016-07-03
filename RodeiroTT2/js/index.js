//Declaración de variables
var nombreUsuario = "Anónimo";
var interior = false;
var ahora = new Date();
var momento = ahora.getTime();
var lat = 43.8;
var lon = -8.99;
var timeOut = 20000;
var maxAge = 600;
var altaPrecision = false;
var precision = 0.76;
var tiempoTranscurrido = 222;
var geoBD;
var tic;
var tac;


function anadirARegistro(fecha, nombre, enumeracion){
    
    itemRegistro = document.createElement("ons-list-item");
    itemRegistro.setAttribute('modifier','material');
    itemRegistro.setAttribute('id',nombre+fecha);
    itemRegistro.innerHTML = nombre + " -> " + (new Date(fecha));
    gdEnumModal = ons.GestureDetector(itemRegistro);
    gdEnumModal.on('tap', function(){
            document.getElementById("enumModal").innerHTML= enumeracion;
            document.getElementById('modal').show();
    });
             
    padre = document.getElementById('historial');
    primerhijo= padre.firstChild;
    if(primerhijo==null)
        padre.appendChild(itemRegistro);
    else
        padre.insertBefore(itemRegistro,primerhijo);

}


function deshabilitarEntradas(){
    document.getElementById("interiorSelector").setAttribute("disabled", "true");
    document.getElementById("username").setAttribute("disabled", "true");
}


function habilitarEntradas(){
    document.getElementById("interiorSelector").removeAttribute("disabled");
    document.getElementById("username").removeAttribute("disabled");
}


function recuperarRegistros(transaccion, resultados){
     var listaRegistros= [];
     var i;
     for (i = 0; i < resultados.rows.length; i++) {
        var fila= resultados.rows.item(i);
        var nuevoJson = {
                nombre: fila.nombre,
                fecha: fila.momento,
                interior: fila.interior,
                lon: fila.lon,
                lat: fila.lat,
                precision: fila.precision,
                altaPrecision: fila.altaPrecision,
                timeOut: fila.timeOut,
                maxAge: fila.maxAge,
                tiempoTranscurrido: fila.tiempoTranscurrido,
                enumeracion: "Nombre: "+fila.nombre+" |LAT: "+fila.lat+" |LON: "+fila.lon+" |Precisión: "+fila.precision+" |AltaPrecisión: "+fila.altaPrecision+
                            " |Interior: "+fila.interior+" |Time Out: "+ fila.timeOut+" |Edad máxima: " + fila.maxAge+" |Tiempo: "+fila.tiempoTranscurrido
            }

        listaRegistros.push(nuevoJson);
     }

     for (var i = 0; i < listaRegistros.length; i++) {
        anadirARegistro(listaRegistros[i].fecha,listaRegistros[i].nombre,listaRegistros[i].enumeracion);
    }

}



function limpiarVistaGeo(){
    var myNode = document.getElementById("listacontadores");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    } 
}

function limpiarVistaReg(){
    var myNode = document.getElementById("historial");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }  

}



var onSuccess = function(position) {
    momento = new Date().getTime();
    tiempoTranscurrido = momento - tic;
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    precision = position.coords.accuracy;

    alert('Latitude: '          +      lat                      + '\n' +
          'Longitude: '         +      lon                      + '\n' +
          'Precisión: '         +      precision                + '\n' +
          'Tiempo transcurrido: '    + tiempoTranscurrido       + '\n');
    habilitarEntradas();

    geoBD.transaction(function (t) {  t.executeSql("INSERT into geoloc (momento,interior, nombre, lat, lon, precision, altaPrecision, timeOut, maxAge, tiempoTranscurrido) values (?,?,?,?,?,?,?,?,?,?)", [momento, interior, nombreUsuario, lat, lon, precision, altaPrecision, timeOut,maxAge, tiempoTranscurrido], function(){
        console.log("INSERTING "+momento+" "+nombreUsuario);
        anadirARegistro(momento,nombreUsuario,"Nombre: "+nombreUsuario+" |LAT: "+lat+" |LON: "+lon+" |Precisión: "+precision+" |AltaPrecisión: "+altaPrecision+
                            " |Interior: "+interior+" |Time Out: "+ timeOut+" |Edad máxima: " + maxAge+" |Tiempo: "+tiempoTranscurrido);

    }); });
};


function onError(error) {
    momento = new Date().getTime();
    tiempoTranscurrido = momento - tic;

    console.log("ERROR"); console.log(error);
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
    habilitarEntradas();

    geoBD.transaction(function (t) {  t.executeSql("INSERT into geoloc (momento,interior, nombre, altaPrecision, timeOut, maxAge, tiempoTranscurrido) values (?,?,?,?,?,?,?)", [momento, interior, nombreUsuario, altaPrecision, timeOut,maxAge, tiempoTranscurrido], function(){
        console.log("INSERTING ERROR "+momento+" "+nombreUsuario);
        anadirARegistro(momento,nombreUsuario,"Nombre: "+nombreUsuario+" |AltaPrecisión: "+altaPrecision+
                            " |Interior: "+interior+" |Time Out: "+ timeOut+" |Edad máxima: " + maxAge+" |Tiempo: "+tiempoTranscurrido);

    },function(){console.log("ERROR INSERTANDO");}); });
}


function actualizarContadores(){

    var contadores = JSON.parse(localStorage.getItem("contadores"));

    if(contadores == undefined){
        contadores = [];
    }

    for (var i = 0; i < contadores.length; i++) {
        itemContador = document.createElement("ons-list-item");
        itemContador.setAttribute('modifier','material');
        itemContador.setAttribute('id','item'+contadores[i].nombre);
        itemContador.innerHTML = "Intentos de "+contadores[i].nombre+": "+contadores[i].contador;

                     
        padre = document.getElementById('listacontadores');
        primerhijo= padre.firstChild;
        if(primerhijo==null)
                padre.appendChild(itemContador);
        else
                padre.insertBefore(itemContador,primerhijo);   
    } 
    
}

function sumarContador(){
    var contadores = JSON.parse(localStorage.getItem("contadores"));
    var nuevo = true;

    if(contadores == undefined){
        contadores = [];
    }

    for (var i = 0; i < contadores.length; i++) {
        if(contadores[i].nombre == nombreUsuario){
            nuevo = false;
            contadores[i].contador = parseInt(contadores[i].contador)+1;
            //Actualizar vista
            var currentItem = document.getElementById('item'+contadores[i].nombre);
            currentItem.innerHTML = "Intentos de "+contadores[i].nombre+": "+contadores[i].contador;
        }
    }

    if(nuevo){
        var nuevoUsuario = {
            nombre: nombreUsuario,
            contador: "1"
        }

        contadores.push(nuevoUsuario);

        //Actualizar vista
        var itemContador = document.createElement("ons-list-item");
        itemContador.setAttribute('modifier','material');
        itemContador.setAttribute('id','item'+nombreUsuario);
        itemContador.innerHTML = "Intentos de "+nombreUsuario+": 1";

                     
        padre = document.getElementById('listacontadores');
        primerhijo= padre.firstChild;
        if(primerhijo==null)
                padre.appendChild(itemContador);
        else
                padre.insertBefore(itemContador,primerhijo);
    }

    localStorage.setItem("contadores", JSON.stringify(contadores));

}

function onload() {

    //Inicializar base de datos
    geoBD= openDatabase("bd_geoloc", "0.1", "BD de posiciones MOVTT2", 1024 * 1024);
    geoBD.transaction(function (t) { t.executeSql("CREATE TABLE IF NOT EXISTS geoloc (momento INTEGER PRIMARY KEY ASC, nombre TEXT, lat REAL, lon REAL, precision REAL, interior INTEGER, altaPrecision INTEGER, timeOut INTEGER, maxAge INTEGER, tiempoTranscurrido INTEGER )");   });



    document.addEventListener('init', function(event) {


        if(event.target.id=='homePage'){
            actualizarContadores();

            geoOptions = {maximumAge: maxAge, timeout: timeOut, enableHighAccuracy: altaPrecision};

            gdGeo = ons.GestureDetector(document.getElementById('botonGeo'));
            gdGeo.on('tap', function(){
                sumarContador();
                tic = new Date().getTime();
                deshabilitarEntradas();
                navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
            },true);


        }

        if(event.target.id=='recordPage'){

            //Sincronizar historial 
            geoBD.transaction(function (t) {t.executeSql("SELECT * FROM geoloc ORDER BY nombre desc, momento", [], recuperarRegistros); });


            //Filtrar
            gdFiltrar = ons.GestureDetector(document.getElementById('botonFiltrar'));
            gdFiltrar.on('tap', function(){
                nombreFiltro = document.getElementById('filtroPorUsuario').value;

                if(nombreFiltro == ""){
                    nombreFiltro = '%';  
                }

                //Borrar vista actual
                limpiarVistaReg();

                //Consulta filtrada
                geoBD.transaction(function (t) {t.executeSql("SELECT * FROM geoloc where nombre like '"+nombreFiltro+"' ORDER BY nombre desc, momento desc", [], recuperarRegistros); });


            },true);


            //Modal
            gdCerrarModal = ons.GestureDetector(document.getElementById('cerrarModal'));
            gdCerrarModal.on('tap', function(){
                document.getElementById('modal').hide();
            },true);


            //Borrar todo
            gdReset = ons.GestureDetector(document.getElementById('botonReset'));
            gdReset.on('tap', function(){
                limpiarVistaReg();
                limpiarVistaGeo();

                geoBD.transaction(function (tx) {
                  tx.executeSql('DROP TABLE geoloc');
                });

                geoBD.transaction(function (t) { t.executeSql("CREATE TABLE IF NOT EXISTS geoloc (momento INTEGER PRIMARY KEY ASC, nombre TEXT, lat REAL, lon REAL, precision REAL, interior INTEGER, altaPrecision INTEGER, timeOut INTEGER, maxAge INTEGER, tiempoTranscurrido INTEGER )");   });

                localStorage.clear();
            },true);


        }



        if(event.target.id=='settingsPage'){
            gdGuardar = ons.GestureDetector(document.getElementById('botonGuardar'));
            gdGuardar.on('tap', function(){
                nombreUsuario = document.getElementById('username').value;
                timeOut = document.getElementById('timeOutInput').value;
                maxAge = document.getElementById('maxAgeInput').value;
                interior = document.getElementById("interiorSelector").checked;
                altaPrecision = document.getElementById("precisionSelector").checked;
                ahora = new Date();
                momento = ahora.getTime();
        
            },true);

        }
    });
      
}
/*
Estructura contadores:

var contadores =  [
        {
            "nombre":"Kevin",
            "contador":"3"
        },
        {
            "nombre":"Ana",
            "contador":"8"
        }

 ]

 Manejo de localstorage


 contadores.push({"nombre":"Anónimo","contador":"2"});

 localStorage.setItem("contadores", JSON.stringify(contadores));

 contadores2 = JSON.parse(localStorage.getItem("contadores"))
*/