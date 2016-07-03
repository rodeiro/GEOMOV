//Declaración de variables
var map;
var tic;
var tac;
var lastPoint;
var parkPoint;
var watchID;
var firstLON;
var firstLAT;
var parkedPosition;
var firstDistance;
var parkedPositionFeature;
var units = "kilometers";



function addRecord(currentDate, enumeration){
    
    itemRecord = document.createElement("ons-list-item");
    itemRecord.setAttribute('modifier','material');
    itemRecord.setAttribute('id', currentDate);
    itemRecord.innerHTML = new Date(currentDate);
    gdEnumModal = ons.GestureDetector(itemRecord);
    gdEnumModal.on('tap', function(){
            document.getElementById("enumModal").innerHTML= enumeration;
            document.getElementById('modal').show();
    });
             
    padre = document.getElementById('pastRecords');
    primerhijo= padre.firstChild;
    if(primerhijo==null)
        padre.appendChild(itemRecord);
    else
        padre.insertBefore(itemRecord,primerhijo);

}


function cleanRecords(){
    var myNode = document.getElementById("pastRecords");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }  

}


function loadRecords(transaccion, result){
     var recordList= [];
     var i;
     for (i = 0; i < result.rows.length; i++) {
        var row= result.rows.item(i);
        var newJson = {
                moment: row.moment,
                lon: row.lon,
                lat: row.lat,
                lonEND: row.lonEND,
                latEND: row.latEND,
                distance: row.distance,
                timeLapse: row.timeLapse,
                enumeration: "First LAT: "+row.lat +" |First LON: "+row.lon +" |Final LAT: "+row.latEND+" |Final LON: "+row.lonEND 
                                +" |Distance: "+row.distance+" m |Time: "+(row.timeLapse/60000)+" min"
            }

        recordList.push(newJson);
     }

     for (var i = 0; i < recordList.length; i++) {
        addRecord(recordList[i].moment,recordList[i].enumeration);
    }

}


function onSuccessPath(position) {
    if(lastPoint != undefined){
        map.removeLayer(lastPoint);
    }

    map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 17);
    lastPoint = L.marker(new L.LatLng(position.coords.latitude, position.coords.longitude));
    map.addLayer(lastPoint);

    var currentPositionFeature = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [position.coords.longitude, position.coords.latitude]
      }
    };


    var currentDistance = (turf.distance(parkedPositionFeature, currentPositionFeature, units)*1000).toFixed(3);

    if(firstDistance == undefined){
        firstDistance = currentDistance;
        tic = new Date().getTime();
        firstLAT = position.coords.latitude;
        firstLON = position.coords.longitude;
    }


    if(currentDistance > 10){
        document.getElementById('distance').innerHTML = "Distance to parking place: "+ currentDistance +" m";
    } else{

        tac = new Date().getTime();
        timeLapse = tac - tic;
        document.getElementById('distance').innerHTML = "Congratulations!";
        navigator.vibrate(3000);
        if (watchID != null) {
            navigator.geolocation.clearWatch(watchID);
            watchID = null;
            map.removeLayer(lastPoint);
            map.removeLayer(parkPoint);
            document.getElementById('geoButton').innerHTML = "Parked";
            localStorage.clear();
        }

        var thisMoment = new Date().getTime();
        addRecord(thisMoment,"First LAT: "+firstLAT +" |First LON: "+firstLON +" |Final LAT: "+parkedPosition.lat+" |Final LON: "+parkedPosition.lon +" |Distance: "+firstDistance+" m |Time: "+(timeLapse/60000)+" min");

        geoBD.transaction(function (t) {  t.executeSql("INSERT into geoMov (moment, lat, lon, latEND, lonEND, distance, timeLapse) values (?,?,?,?,?,?,?)", [thisMoment,firstLAT,firstLON,parkedPosition.lat,parkedPosition.lon,firstDistance,timeLapse], 
            function(){         firstDistance = undefined;  },function(e,r){console.log(r);}); });
    }
    
    
}




function onErrorPath(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');

    document.getElementById('geoButton').innerHTML = "Parked";
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


var onSuccess = function(position) {

    momento = new Date().getTime();
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    precision = position.coords.accuracy;

    alert('Latitude: '          +      lat                      + '\n' +
          'Longitude: '         +      lon                      + '\n');


    //Car Position marker
    parkPoint = L.marker(new L.LatLng(position.coords.latitude, position.coords.longitude));
    map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 17);
    map.addLayer(parkPoint);

    //Car Position Storage
    parkedPosition = {"lat":lat,"lon":lon}
    localStorage.setItem("parked", JSON.stringify(parkedPosition));
    parkedPositionFeature = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [lon, lat]
      }
    };

};




function onError(error) {
    alert("Unable to get position");
    document.getElementById('geoButton').innerHTML = "Parked";
}



function onDeviceReady() {

    geoBD= openDatabase("bd_geoloc", "0.1", "BD MOVTT4", 1024 * 1024);
    geoBD.transaction(function (t) { t.executeSql("CREATE TABLE IF NOT EXISTS geoMov (moment INTEGER PRIMARY KEY ASC, lat REAL, lon REAL, latEND REAL, lonEND REAL, distance REAL, timeLapse INTEGER )");   });



    document.addEventListener('init', function(event) {


        if(event.target.id=='homePage'){


            //Map
            var stamenTonerLiteLayer = new L.TileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png');
            map = L.map('map');
            map.setView(new L.LatLng(43.50, -8.25), 10);
            map.addLayer(stamenTonerLiteLayer);


            //Check session
            var alreadyParked = JSON.parse(localStorage.getItem("parked"));
            if(alreadyParked != undefined){
                parkedPosition = alreadyParked;
                parkPoint = L.marker(new L.LatLng(parkedPosition.lat, parkedPosition.lon));
                map.setView(new L.LatLng(parkedPosition.lat, parkedPosition.lon), 17);
                map.addLayer(parkPoint);

                parkedPositionFeature = {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                    "type": "Point",
                    "coordinates": [parkedPosition.lon, parkedPosition.lat]
                  }
                };

                document.getElementById('geoButton').innerHTML = "How  much is left?";
            }else{
                document.getElementById('geoButton').innerHTML = "Parked";
            }



           
            var optionsPath = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };

            geoOptions = {maximumAge: 600, timeout: 10000, enableHighAccuracy: true};

            gdGeo = ons.GestureDetector(document.getElementById('geoButton'));
            gdGeo.on('tap', function(){

                if (document.getElementById('geoButton').innerHTML == "Parked"){
                    document.getElementById('distance').innerHTML = "";
                    document.getElementById('geoButton').innerHTML = "How  much is left?";
                    
                    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);

                }else{

                    document.getElementById('geoButton').innerHTML = "Parked";
                    watchID = navigator.geolocation.watchPosition(onSuccessPath, onErrorPath, optionsPath);
                    
                }
            },true);





            //Show Map 
            var mapButton = document.getElementById('mapButton');
            var mapView = document.getElementById('map');
            mapView.style.display = "none";


            mapButton.addEventListener("click", function(){

                    if(mapView.style.display == "none"){

                        if(checkConnection()==1){
                            if (confirm("This action may involve a high data consumption") == false) {
                                return;
                            } 
                        }else if(checkConnection()==0){
                            alert("There is no connection");
                            return;
                        }

                        mapButton.innerHTML = "Hide map";
                        mapView.style.display = "block";
                    }else{
                        mapButton.innerHTML = "Show map";
                        mapView.style.display = "none";
                    }



            });


        }

        if(event.target.id=='recordPage'){

             geoBD.transaction(function (t) {t.executeSql("SELECT * FROM geoMov ORDER BY moment desc", [], loadRecords); });

            //Modal
            gdCloseModal = ons.GestureDetector(document.getElementById('closeModal'));
            gdCloseModal.on('tap', function(){
                document.getElementById('modal').hide();
            },true);

            //RESET
            gdReset = ons.GestureDetector(document.getElementById('botonReset'));
            gdReset.on('tap', function(){
                cleanRecords();
                geoBD.transaction(function (t) {  t.executeSql("DELETE from geoMov", [], function(){}  ,function(e,r){console.log(r);}); });
                localStorage.clear();
                document.getElementById('geoButton').innerHTML = "Parked";
                document.getElementById('distance').innerHTML = "";
                if (watchID != null) {
                    navigator.geolocation.clearWatch(watchID);
                    watchID = null;
                }


                if(parkPoint != undefined){
                    map.removeLayer(parkPoint);
                }

                if(lastPoint != undefined){
                    map.removeLayer(lastPoint);
                }
            },true);


            //Filter
            gdFiltrar = ons.GestureDetector(document.getElementById('filterButton'));
            gdFiltrar.on('tap', function(){
                userInput = document.getElementById('distanceFilter').value;

                if(userInput == ""){
                    userInput = 0;  
                }

                cleanRecords();
                geoBD.transaction(function (t) {t.executeSql("SELECT * FROM geoMov where distance > "+userInput+" ORDER BY distance", [], loadRecords); });
            },true);

        }


    });
      
}

function onload() {  

    document.addEventListener("deviceready", onDeviceReady, false);
  
}

