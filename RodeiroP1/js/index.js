
function yaEnLista(lista, nombre){
	for (var i = 0; i < lista.length; i++) {
		if(lista[i].producto == nombre){
			return true;
		}
	}
	return false;

}

function anadirACompras(lista, fecha, enumeracion){

		itemcompras = document.createElement("ons-list-item");
		itemcompras.setAttribute('modifier','material');
		itemcompras.setAttribute('id',fecha);

		itemcompras.innerHTML = fecha;
		gdEnumModal = ons.GestureDetector(itemcompras);
		gdEnumModal.on('tap', function(){
			document.getElementById("enumModal").innerHTML= enumeracion;
			document.getElementById('modal').show();
		});
			 
		padre = document.getElementById('historial');
		primerhijo= padre.firstChild;
		if(primerhijo==null)
			padre.appendChild(itemcompras);
		else
			padre.insertBefore(itemcompras,primerhijo);

}





function anadirALista(lista, nombre){
		selectorProducto = document.createElement("ons-switch");
		selectorProducto.setAttribute('modifier','material');
		selectorProducto.setAttribute('id',nombre+"selector");

//Gestionar selectores
		   for (var i = 0; i < lista.length; i++) {
				if((lista[i].producto == nombre) && (lista[i].comprado)){
					selectorProducto.checked= lista[i].comprado;
				}
		   }

		selectorProducto.addEventListener("change",function(){
			//Cambiar el estado del producto en memoria
		   for (var i = 0; i < lista.length; i++) {
				if(lista[i].producto == nombre){
					lista[i].comprado = document.getElementById(nombre+'selector').checked;
				}
		   }
		localStorage.setItem("listaProductos", JSON.stringify(lista));

		});
		textoProducto = document.createElement("div");


		itemcompra = document.createElement("ons-list-item");
		itemcompra.setAttribute('modifier','material');
		itemcompra.setAttribute('id',nombre+'Item');


		textoProducto.innerHTML = nombre;
		textoProducto.setAttribute('id',nombre);

		//Modificar elemento 
		gdTextoProducto = ons.GestureDetector(textoProducto);
		gdTextoProducto.on('hold', function(evt){
			var modificacion = document.getElementById('modificarProductoInput');
			modificacion.value = evt.target.id;
			modificacion.setAttribute('idAnterior',evt.target.id);
			document.getElementById('dialogoModificar').show();
		});

		 //Borrar elemento COMENTAR PARA PRUEBAS EN EL PC SI MODIFICAR
	    gdTextoProductoHold = ons.GestureDetector(textoProducto);
		gdTextoProductoHold.on('doubletap', function(evt){
			var padre = document.getElementById('listacompras');
			padre.removeChild(document.getElementById(evt.target.id+'Item'));

			for(var x = 0; x < lista.length;x++){
				if(lista[x].producto == evt.target.id){
					lista.splice(x, 1);   
				}
			}

			localStorage.setItem("listaProductos", JSON.stringify(lista));

		});
	
		itemcompra.appendChild(textoProducto);
		itemcompra.appendChild(selectorProducto);


	   
		padre = document.getElementById('listacompras');
		primerhijo= padre.firstChild;
		if(primerhijo==null)
			padre.appendChild(itemcompra);
		else
			padre.insertBefore(itemcompra,primerhijo);

}





function recuperarLista(){
	var listaProductos = JSON.parse(localStorage.getItem("listaProductos"));
	if (listaProductos == null){
		listaProductos = [];
	}
	return listaProductos;
}


function recuperarCompras(){
	var listaCompras = JSON.parse(localStorage.getItem("listaCompras"));
	if (listaCompras == null){
		listaCompras = [];
	}
	return listaCompras;

}


function sinronizarLista(){
	var listaProductos = recuperarLista();
	for (var i = 0; i < listaProductos.length; i++) {
		anadirALista(listaProductos,listaProductos[i].producto);
	}
	return listaProductos;
}


function sincronizarCompras(){
	var listaCompras = recuperarCompras();
	for (var i = 0; i < listaCompras.length; i++) {
		anadirACompras(listaCompras,listaCompras[i].fecha,listaCompras[i].productos);
	}
	return listaCompras;

}





function onload() {
	var listaCompras;
	var listaProductos;


	document.addEventListener('init', function(event) {

		if(event.target.id=='comprasPagina'){
			listaCompras  = sincronizarCompras();
			gdCerrarModal = ons.GestureDetector(document.getElementById('cerrarModal'));
		  	gdCerrarModal.on('tap', function(){
				document.getElementById('modal').hide();
			},true);

		}


		if(event.target.id=='listaPagina'){
			listaProductos = sinronizarLista();
			
/********************************************DANGER ZONE********************************************/
			/*gd = ons.GestureDetector(document.getElementById('speedNuevo'));		   
			gd.on('tap', function(){*/

			document.getElementById('speedNuevo').addEventListener("click", function(){
				document.getElementById('dialogoAnadir').show();
			});
/********************************************DANGER ZONE ENDS********************************************/

			gdConfirmaCompra = ons.GestureDetector(document.getElementById('speedCompra'));		   
			gdConfirmaCompra.on('tap', function(){
					//confirmar COMPRA
					var indexes = [];
					var enumeracion = "";
					var padre = document.getElementById('listacompras');

					//Actualizar lista productos
					for (var i = 0; i < listaProductos.length; i++) {
						if(document.getElementById(listaProductos[i].producto+'selector').checked){
							indexes.push(i);
							enumeracion = enumeracion+" "+listaProductos[i].producto;
							padre.removeChild(document.getElementById(listaProductos[i].producto+'Item'));
						}
					}

					//Actualizar historial en memoria
					var fechaActual =Date(Date.now());
					listaCompras.push({"fecha":fechaActual,"productos":enumeracion});


					//Actualizar historial compras
					anadirACompras(listaCompras, fechaActual, enumeracion);

					//Actualizar lista en memoria
					for(var x = indexes.length -1; x >= 0;x--){
						listaProductos.splice(indexes[x], 1);
					}

					//Sincronizar localStorage
					localStorage.setItem("listaProductos", JSON.stringify(listaProductos));
					localStorage.setItem("listaCompras", JSON.stringify(listaCompras));

			});

			
		   gdBotonAnadir = ons.GestureDetector(document.getElementById('botonAnadir'));
			gdBotonAnadir.on('tap', function(){ 

				var nuevo = document.getElementById('nuevoProductoInput').value;
				if(yaEnLista(listaProductos,nuevo)){
					alert("Ese producto ya fue añadido");
					document.getElementById('nuevoProductoInput').value="";
				}else{
					
					document.getElementById('nuevoProductoInput').value = "";
					//Actualizar lista
					anadirALista(listaProductos,nuevo);

				  //Sincronizar LocalStorage
					listaProductos.push({"producto":nuevo,"comprado":"false"});
					localStorage.setItem("listaProductos", JSON.stringify(listaProductos));
				}
				document.getElementById('dialogoAnadir').hide();
			},true);


			gdBotonModificar = ons.GestureDetector(document.getElementById('botonModificar'));
			gdBotonModificar.on('tap', function(){ 
			  				
				var idAnterior = document.getElementById('modificarProductoInput').getAttribute('idAnterior');
				var modificado = document.getElementById('modificarProductoInput').value;
				
				if(yaEnLista(listaProductos,modificado)){
						alert("Este producto ya está en la lista");
				}else{

					//Actualizar lista
					for(var x = 0; x < listaProductos.length;x++){
						if(listaProductos[x].producto == idAnterior){
							listaProductos[x].producto = modificado;
						}
					}
					
					//Actualizar localStorage
					localStorage.setItem("listaProductos", JSON.stringify(listaProductos));

					//Actualizar la vista
				   var anteriorTexto = document.getElementById(idAnterior);
					anteriorTexto.setAttribute('id',modificado);
					anteriorTexto.innerHTML=  modificado;

					var anteriorSelector = document.getElementById(idAnterior+'selector');
					anteriorSelector.setAttribute('id',modificado+'selector');

					var anteriorItem = document.getElementById(idAnterior+'Item');
					anteriorItem.setAttribute('id',modificado+'Item');

					document.getElementById('dialogoModificar').hide();
				}
			},true);

		}


/*Lista ejemplo JSON
var listaProductos =  [
		{
			"producto":"pan",
			"comprado":"true"
		},
		{
			"producto":"agua",
			"comprado":"false"
		}

 ]




 listaProductos.push({"producto":"aceite","comprado":"false"});

 localStorage.setItem("listaProductos", JSON.stringify(listaProductos));

 listaPrueba = JSON.parse(localStorage.getItem("listaProductos"))

var listaCompras =  [
		{
			"fecha":"15-04-2016",
			"productos":"aceite,agua,sal"
		},
		{
			"fecha":"09-01-2016",
			"productos":"pan,tomates,queso"
		}

 ]


 */


	});

}
