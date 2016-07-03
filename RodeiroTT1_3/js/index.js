      function onload() {
        document.getElementById('touchme').addEventListener('touchstart', function(ev) { 
                      console.log("ev.targetTouches"); console.log(ev.targetTouches.length);
                      document.getElementById("informacion1").innerHTML = "Detectados "+ev.targetTouches.length + " dedos";  
                      document.getElementById("informacion2").innerHTML = "Último evento: touchstart";      
        },false);


        document.getElementById('touchme').addEventListener('touchend', function(ev) { 
                      console.log("ev.targetTouches"); console.log(ev.targetTouches.length);
                      document.getElementById("informacion1").innerHTML = "Detectados "+ev.targetTouches.length + " dedos";
                      document.getElementById("informacion2").innerHTML = "Último evento: touchend";    
        },false);

        document.getElementById('touchme').addEventListener('touchcancel', function(ev) { 
                      console.log("ev.targetTouches"); console.log(ev.targetTouches.length);
                      document.getElementById("informacion1").innerHTML = "Detectados "+ev.targetTouches.length + " dedos";  
                      document.getElementById("informacion2").innerHTML = "Último evento: touchcancel";      
        },false);

        document.getElementById('touchme').addEventListener('touchmove', function(ev) { 
                      console.log("ev.targetTouches"); console.log(ev.targetTouches.length);
                      document.getElementById("informacion1").innerHTML = "Detectados "+ev.targetTouches.length + " dedos"; 
                      document.getElementById("informacion2").innerHTML = "Último evento: touchmove";    
        },false);


    }
