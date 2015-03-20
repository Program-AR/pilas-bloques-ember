/// <reference path = "../../dependencias/pilasweb.d.ts" />


/**
 * New typescript file
 */
class EscenaConObjetos extends Base {
	objetos = [];
	
	eliminarObjeto(unObjeto){
		this.objetos.splice(this.objetos.indexOf(unObjeto),1);
		unObjeto.eliminar();
	}
	
	objetoTocandoA(toqueton){
		return this.objetos.filter(objeto => objeto.colisiona_con(toqueton))[0];
	}
	
	tocandoTipo(unActor,tipo){
        return pilas.escena_actual().objetos.some(objeto => objeto.colisiona_con(unActor) && objeto.nombreClase()==tipo);
    }
}