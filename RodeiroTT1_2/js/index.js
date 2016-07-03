var prohibidoVolumen = false;
var contadorPause;
var contadorResume;

function firstContact() {
    var person = prompt("¿Cuál es tu nombre?", "Miguel Luaces");
    
    if (person != null) {
        document.getElementById("demo").innerHTML = "¡Encantado, " + person + "! ¿Qué tal todo?";
    } else {
		document.getElementById("demo").innerHTML = "Te llamaré ANONYMOUS"
    }
}


function showOS(){
	document.getElementById("os").innerHTML = "Nos vemos a través de un " + device.platform +" "+ device.version;
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';


    document.getElementById("connection").innerHTML = "Conexión: "+states[networkState];
    if (networkState == Connection.NONE || networkState == Connection.UNKNOWN){
		document.getElementById("connection").className = "offline";
    } else{
    	document.getElementById("connection").className = "online";
    }

}

function cambiaVolumen(){
	prohibidoVolumen = !prohibidoVolumen;
}

function onVolumeChange() {

	if(prohibidoVolumen){
		console.log("Momentos musicales");
		alert("Momentos musicales");
		navigator.notification.beep(3);
	}

}




function onPause(){
	contadorPause = localStorage.getItem("contadorPause");
	
	if(contadorPause==null){
		contadorPause = 0;
	}

	contadorPause = parseInt(contadorPause) + 1;
	localStorage.setItem("contadorPause",contadorPause);
	setCounts();
}



function onResume(){

	contadorResume = localStorage.getItem("contadorResume");

	if(contadorResume==null){
		contadorResume = 0;
	}

	contadorResume = parseInt(contadorResume) + 1;
	localStorage.setItem("contadorResume",contadorResume);

	setCounts();

}

function setCounts(){
	contadorPause = localStorage.getItem("contadorPause");
	contadorResume = localStorage.getItem("contadorResume");


	if(contadorPause==null){
		contadorPause = 0;
		localStorage.setItem("contadorPause",contadorPause);
	}

	if(contadorResume==null){
		contadorResume = 0;
		localStorage.setItem("contadorResume",contadorResume);
	}

	document.getElementById("resume").innerHTML = "Reanudada: "+contadorResume+" veces";
	document.getElementById("pause").innerHTML = "Pausada: "+contadorPause+" veces";

}


function resetearStorage(){
	localStorage.clear();
	document.getElementById("ready").innerHTML = "Iniciada: 0 veces";
	setCounts();
}

var acelerometro = true;
function onSuccess(acceleration) {

	if(acelerometro){
		if ((Math.round(acceleration.x) == 0) && (Math.round(acceleration.y) == 0) &&  (Math.round(acceleration.z) == -10)){
			acelerometro = false;
			navigator.vibrate(3000);

		}else{

		    document.getElementById("acelera").innerHTML = 'Acceleration X: ' + Math.round(acceleration.x) + '\n' +
		          'Acceleration Y: ' + Math.round(acceleration.y) + '\n' +
		          'Acceleration Z: ' + Math.round(acceleration.z) + '\n' +
		          'Timestamp: '      + acceleration.timestamp + '\n';
		}

	}
}

function onError() {
    alert('Demasiada aceleración');
}

function acelera(){
	navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
}



function onLoad(){
	document.addEventListener('deviceready', this.onDeviceReady, false);
	document.addEventListener("volumedownbutton", onVolumeChange, false);
	document.addEventListener("volumeupbutton", onVolumeChange, false);
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
}


function onDeviceReady(){
	
	var contadorReady = localStorage.getItem("contadorReady");

	if(contadorReady==null){
		contadorReady = 0;
	}

	contadorReady = parseInt(contadorReady) + 1;
	document.getElementById("ready").innerHTML = "Iniciada: "+contadorReady+" veces";
	localStorage.setItem("contadorReady",contadorReady);


	firstContact();
	checkConnection();
	showOS();
	setCounts();
	setInterval(function() {
		checkConnection();
	}, 10000);

	setInterval(function() {
		acelera();
	}, 500);
}


