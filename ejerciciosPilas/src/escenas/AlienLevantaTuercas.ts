/// <reference path = "../../dependencias/pilasweb.d.ts"/>




/********** POR FAVOR NO MIRAR ESTA CLASE. NO SIRVE DE EJEMPLO *************/
/********** POR FAVOR NO MIRAR ESTA CLASE. NO SIRVE DE EJEMPLO *************/
/********** POR FAVOR NO MIRAR ESTA CLASE. NO SIRVE DE EJEMPLO *************/
/********** POR FAVOR NO MIRAR ESTA CLASE. NO SIRVE DE EJEMPLO *************/

function convertir_posicion_a_coordenada(fila, columna) {
	/*

                   columnas 
                      1            2       3       4       5       6
          filas

            1    [- 175,  140]     []      []      []       []      []
            2    [- 175,   60]
            3    [- 175,  -20]
            4    [- 175, -100]
            5    [- 175, -180]

	 */
	
	
	var columnas = [-175, -105, -35, 35, 105, 175];
	var filas = [140, 60, -20, -100, -180];
	
	return {x: columnas[columna-1], y: filas[fila-1]};
}

class AlienLevantaTuercas extends Base {

    iniciar(){
	    var fondo = new pilas.fondos.Laberinto1();
	    var alien = new pilas.actores.Alien(-175, -180);
	
	    alien.cuando_busca_recoger = function() {
	      var actores = pilas.obtener_actores_en(alien.x, alien.y + 20, 'Tuerca')
	
	      if (actores.length > 0) {
	        var mensaje = "";
	        actores[0].eliminar();
	        var restantes = pilas.obtener_actores_con_etiqueta("Tuerca").length;
	
	        if (restantes > 0)
	          mensaje = "genial, aún quedan: " + restantes;
	        else
	          mensaje = "¡Nivel completado!"
	      
	        alien.decir(mensaje);
	        console.log(mensaje);
	      }
	    }
	
	
	    var posicion = convertir_posicion_a_coordenada(1, 1);
	    var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);
	
	    var posicion = convertir_posicion_a_coordenada(3, 2);
	    var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);
	
	    var posicion = convertir_posicion_a_coordenada(5, 3);
	    var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);
	
	    var posicion = convertir_posicion_a_coordenada(3, 6);
	    var tuerca = new pilas.actores.Tuerca(posicion.x, posicion.y);
	
	    //window.tuerca = tuerca;
    }

}