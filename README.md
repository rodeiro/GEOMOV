# GEOMOV
Cordova + Leaflet + Onsen

+++ P1

Pruebas de ONSEN

+++ P2

Manejo de ficheros

+++++ TT1
1. Configura el entorno de trabajo para desarrollar aplicaciones híbridas con PhoneGap (puede ser
necesario instalar/configurar algunas de las siguientes herramientas/utilidades: PhoneGap Desktop,
PhoneGap CLI, PhoneGap Developer App, Ripple Emulator, Node.js, Git, PhoneGap Build, android-sdk,
etc). Todas las aplicaciones que entregues deben estar alojadas en un repositorio público de Github y
deben ser creadas mediante PhoneGap Build.

2. (1 punto) Crea una única aplicación móvil que contenga las funcionalidades que se describen en los
subapartados de este ejercicio. No debes utilizar más plugins de los necesarios. El nombre de la
aplicación debe de ser PrimerApellido TT1_2 y debes utilizar un icono propio.
2.1. Al iniciarse, la aplicación debe preguntar el nombre de usuario mediante un cuadro de diálogo, con
dos opciones: “OK” y “Cancelar”. En caso de que el usuario pulse “OK”, debe mostrar un texto con
un saludo utilizando el nombre introducido. En caso de que el usuario pulse “Cancelar” debe indicar
un texto alternativo.
2.2. La aplicación debe mostrar el sistema operativo, modelo del dispositivo y el tipo de conexión a
internet. El tipo de conexión debe mostrarse con fondo rojo en caso de que el dispositivo esté
offline y con fondo verde en caso de que esté online. Además debe actualizar cada 10 segundos el
tipo de conexión que tiene.
2.3. La aplicación debe visualizar el número de veces que se ha iniciado, el número de veces que se ha
pausado y el número de veces que se ha reanudado. Además, debe haber un botón que permita
reiniciar todos los contadores al valor cero.
2.4. Mientras la aplicación se está ejecutando no debe permitir subir el volumen del móvil al pulsar la
tecla correspondiente. En vez de subir el volumen debe mostrar una alerta indicando que no se
permite subir el volumen y hacer sonar tres beeps.
2.5. La aplicación debe mostrar los datos obtenidos por el acelerómetro (x,y,x), actualizándose cada
medio segundo. Esta actualización debe parar cuando el que el dispositivo se ponga boca abajo. En
ese momento debe vibrar durante 3 segundos y dejar de actualizar los valores del acelerómetro.

3. (0,25 puntos) Crea una aplicación móvil que tenga la pantalla dividida verticalmente en dos zonas
diferenciadas por el color de fondo. La aplicación debe responder ante eventos táctiles realizados en la
zona superior de la aplicación mostrando en la zona inferior dos datos: el número de dedos que
conforman el movimiento actual (iniciados todos en la zona superior) y último evento disparado. No
debes utilizar más plugins de los necesarios. El nombre de la aplicación debe de ser PrimerApellido
TT1_3.


++++ TT2
1. (0,75 punto) Crea una única aplicación móvil que contenga las funcionalidades que se describen en los
subapartados de este ejercicio. No debes utilizar más plugins de los necesarios. El nombre de la
aplicación debe de ser PrimerApellido TT2 y debes utilizar un icono propio. La aplicación va a permitir
registrar la ubicación de diferentes usuarios en el momento que pulsen un botón, permitiendo elegir al
usuario las opciones de geolocalización, y visualizar posteriormente dichas ubicaciones. Más
concretamente:
1.1. La aplicación debe tener un cuadro de texto que permita al usuario poner su nombre y un selector
que permita indicar si está en interior o exterior. Estos valores deben poder editarse en cualquier
momento, excepto mientras se está obteniendo la localización del usuario.
1.2. La aplicación debe permitir al usuario establecer el valor de los parámetros maximumAge, timeout y
enableHighAccuracy. La forma en la que se permita introducir estos parámetros se deja a elección
del alumno.
1.3. La aplicación debe tener un botón que al ser pulsado obtenga la ubicación del usuario.
1.4. La aplicación debe mostrar en un mensaje emergente los valores de la posición obtenida (los
valores de longitud, latitud y precisión), además del tiempo transcurrido entre que se pulsó el botón
y se obtuvo la ubicación.
1.5. La aplicación debe almacenar el nombre del usuario, si el usuario estaba en interior o exterior, las
opciones seleccionadas para la obtención de la posición, los valores de la posición obtenida
(longitud, latitud, precisión) y el tiempo transcurrido de forma persistente.
1.6. En caso de que no sea posible obtener una ubicación, se mostrará el error obtenido y se almacenará
igualmente intento de registro de ubicación con los valores del nombre de usuario y de los
parámetros de geolocalización.
1.7. La aplicación debe mostrar el número de intentos de ubicación realizados para cada usuario
(considerando sólo los usuarios que alguna vez pulsaron el botón).
1.8. La aplicación debe tener la posibilidad de visualizar la lista de ubicaciones registradas hasta el
momento y filtrar por nombre de usuario. Los datos deben mostrarse ordenados por usuario
primero y por fecha después.
1.9. La aplicación debe tener una opción para poder eliminar toda la información almacenada.


++++ TT3
1. (1 punto) Crea una única aplicación móvil que contenga las funcionalidades que se describen en los
subapartados de este ejercicio. La aplicación va a permitir rastrear la ruta seguida por el usuario, con la
posibilidad de mostrarla en el momento, y almacenar dicha ruta para posteriormente visualizarla.
Además obtendrá el nombre de la dirección de salida y llegada para almacenar la descripción de la ruta.
Más concretamente:
1.1. La aplicación debe tener dos vistas: una para registrar nuevas rutas y otra para visualizarlas.
1.2. En la vista de registrar rutas debe haber un elemento (switch/botón/…) que utilizará el usuario para
indicar cuándo empezar y acabar de registrar su posición. Inicialmente estará desactivada. Tan
pronto se active, debe empezar a registrar posiciones con los siguientes parámetros:
enableHighAccuracy: true, maximumAge: 0, timeout: 10000. Cuando se desactive debe parar de
registrar posiciones. Se deben ir almacenando las posiciones (latitud y longitud) en el localStorage.
1.3. Debe tener también otro elemento (switch/botón/checkbox/…) que le permita al usuario indicar si
quiere ir visualizando en un mapa las posiciones que va obteniendo. Por defecto no se visualizarán
en el mapa. En caso de que el usuario lo active, si el usuario está conectado por wifi, mostrará el
mapa directamente. Si está conectado por red móvil le mostrará un mensaje indicando que puede
conllevar consumo elevado de datos y le permitirá seguir con la visualización o cancelar la
visualización. Si no está conectado a internet le mostrará un mensaje indicando que no es posible.
1.4. Cuando se finalice el registro de la ruta crea un geojson de la línea de la ruta (LineString) y
almacénalo en un directorio del sistema de ficheros que sea no privado (de forma que se puedan
ver desde un explorador de archivos). No es necesario que lo crees de forma manual, puedes
utilizar Turf para ello. Usa el nombre PrimerApellidoTT3_x.json, siendo x un contador que indique el
número de ficheros creados hasta la fecha. En caso de que falle la escritura, debes mostrar un
mensaje de error.
1.5. El geojson anterior debe tener, además de la ruta, las siguientes propiedades: inicio, fin, fecha y
distancia (en kilómetros). Inicio y fin son las dirección de las posiciones inicial y final (puedes utilizar
el servicio web para geocodificación inversa que quieras; en caso de no poder conectar con un
servidor para calcular su dirección se establecerá la dirección a “Dirección desconocida”), la fecha
es la hora de la última posición almacenada y la distancia recorrida la puedes calcular usando Turf.
1.6. La otra vista debe poder abrir un geojson almacenado pasándole un número. Puedes hacer la
interacción con el usuario como prefieras (mediante cuadro de texto y un botón, con un mensaje
emergente al cambiar la vista, etc), de forma que abrirá el archivo PrimerApellidoTT3_x.json (siendo
x el número que ha indicado el usuario) del sistema de ficheros donde se estén almacenando en el
punto 1.5. En caso de no encontrarlo mostrará un error. En caso de encontrar el fichero, mostrará el
contenido en un mapa (en forma de línea). Debes mostrar los mismos mensajes de alerta y error 
dependiendo de la conexión del usuario que en el apartado 1.4. Además debes incluir un marcador
para el punto de inicio de la ruta y otro en el punto de fin, indicando en cada uno de ellos su
dirección. En el de fin además pondrá la fecha de fin y la distancia recorrida.
1.7. Otras observaciones:
• No debes utilizar más plugins de los necesarios.
• Debes limitar el acceso de la aplicación a los servidores que vayas a utilizar.
• El nombre de la aplicación debe de ser PrimerApellido TT3 y debes utilizar un icono propio.
• En la descripción de la aplicación debes indicar que se almacenarán las rutas que registre el
usuario en una carpeta no privada del dispositivo, que el usuario puede eliminar si lo desea.
• Puedes utilizar la librería de visualización de mapas que prefieras.
• Recuerda que para registrar posiciones correctamente, la aplicación debe estar ejecutándose
(no en segundo plano).



