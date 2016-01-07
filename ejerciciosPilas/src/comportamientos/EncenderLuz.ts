/// <reference path="ComportamientoAnimado.ts"/>
/// <reference path="../habilidades/HabilidadAnimada.ts"/>
/// <reference path = "../escenas/Errores.ts" />
	
class EncenderLuz extends Comportamiento {
	
	actualizar() {
		if (this.tocandoLuz()) {
			this.getLuz().agregar_habilidad(HabilidadAnimada, {nombreAnimacion: 'prendida'});
		} else {
			throw new ActividadError('¡Aquí no hay una luz por prender!');
		}
		return true;
    }
    
    tocandoLuz() {
    	return pilas.obtener_actores_con_etiqueta('Lamparin').some(objeto => objeto.colisiona_con(this.receptor));
    }
    
    getLuz() {
    	return pilas.obtener_actores_con_etiqueta('Lamparin').filter(objeto => objeto.colisiona_con(this.receptor))[0];
    }
}