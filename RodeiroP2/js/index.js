var fichero;

function lector(){

    if(!fichero){ 

        alert("Error al leer el fichero"); 

    }else{

        fichero.file(function(e) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                alert(evt.target.result);
            };
            reader.readAsText(e);
        },function(){
            alert("Error al leer el fichero");
        });    
    }

}

function escritor(contenido){

    if(!fichero){ 

        alert("Error al escribir"); 

    }else{

        fichero.createWriter(function(fileWriter) {
            
                fileWriter.seek(fileWriter.length);
                
                var blob = new Blob([contenido], {type:'text/plain'});
                fileWriter.write(blob);

                //Dimensión del fichero
                fichero.getMetadata(
                    function (metadata) {
                        alert("El fichero contiene ahora "+ (parseInt(metadata.size) + parseInt(contenido.length)) +" bytes"); // get file size
                    }, 
                    function (error) {alert("Error al acceder a metadatos");}
                );
            }, function(){
                alert("Error al escribir el archivo");
            }
        );

    }

   

}


function onDeviceReady() {

   var selector = document.getElementById("selector");
    var marcada = "cacheDirectory";
    var ruta = cordova.file.cacheDirectory;
        
    document.getElementById('selector').addEventListener('change', function(ev) {
        if(selector.options[selector.selectedIndex].value == "cacheDirectory"){
            ruta = cordova.file.cacheDirectory;
        } else if (selector.options[selector.selectedIndex].value == "dataDirectory"){
            ruta = cordova.file.dataDirectory;
        }else if (selector.options[selector.selectedIndex].value == "externalRootDirectory"){
            ruta = cordova.file.externalRootDirectory;
        }else if (selector.options[selector.selectedIndex].value == "externalCacheDirectory"){
            ruta = cordova.file.externalCacheDirectory;
        }else if (selector.options[selector.selectedIndex].value == "externalDataDirectory"){
            ruta = cordova.file.externalDataDirectory;
        }

    },false);

        gdCrear = ons.GestureDetector(document.getElementById('botonCrear'));
        gdCrear.on('tap', function(){
            var nombre = document.getElementById('nombreArchivo').value;
            if((nombre == "")||(nombre == undefined)){
                alert("Sin un nombre de fichero no puedo trabajar");
            }else{
                window.resolveLocalFileSystemURL(ruta, function(dir) {                    
                    dir.getFile(nombre+".txt", {create:true}, function(file) {
                        alert("Se ha abierto el fichero "+ nombre);     
                        fichero = file;     
                    }, function(){alert("Error");});
                },function(){alert("Error al localizar directorio");});
            }
        });


        gdEscribir = ons.GestureDetector(document.getElementById('botonEscribir'));
        gdEscribir.on('tap', function(){
            var contenido = document.getElementById('contenidoArchivo').value;
            if((contenido == "")||(contenido == undefined)){
                alert("¡No hay contenido que escribir!");
            }else{
                escritor(contenido);
            }
        });


        gdLeer = ons.GestureDetector(document.getElementById('botonLeer'));
        gdLeer.on('tap', function(){
            lector();
        });


        gdBorrar = ons.GestureDetector(document.getElementById('botonBorrar'));
        gdBorrar.on('tap', function(){

            if(!fichero){ 

                alert("Error al borrar"); 

            }else{

                fichero.remove(function(file){
                    alert("Fichero borrado");
                },function(file){
                    alert("Error al borrar");
                });
            }

        });




}

function onload() {  

    document.addEventListener("deviceready", onDeviceReady, false);
  
}