/// <reference path = "../../dependencias/pilasweb.d.ts" />


/**
 * New typescript file
 */
class EscenaConObjetos extends Base {
	objetos = {};
	
	eliminarObjeto(unObjeto){
		var clave = this.dameClave(unObjeto);
		this.objetos[clave].splice(this.objetos[clave].indexOf(unObjeto),1);
		unObjeto.eliminar();
	}
	
	objetoTocandoA(toqueton,clave){
		return this.objetos[clave].filter(objeto => objeto.colisiona_con(toqueton))[0];
	}
	
	tocandoTipo(unActor,clave){   
        return this.objetos[clave].some(objeto => objeto.colisiona_con(unActor));
    }

    dameClave(unObjeto){
    	for (var key in this.objetos){
    		if (this.objetos[key].indexOf(unObjeto)!=-1) {
    			return key
    		}
    			
    	}


    }
}