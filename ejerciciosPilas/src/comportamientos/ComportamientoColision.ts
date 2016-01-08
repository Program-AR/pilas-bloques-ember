/// <reference path = "../escenas/Errores.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts" />
// <reference path = "../escenas/EstadosDeEscena.ts" />
/*
Es un comportamiento genérico con la idea de ser extendido
Sus características son

Si se está colisionando con un objeto de etiqueta A:
	Realizar acciones dependientes de ese objeto
Caso Contrario:
	El personaje principal ejecuta un mensaje de error.

La escena que lo utiliza debe tener definido
automata

*/


class ComportamientoColision extends ComportamientoAnimado {
	/*nombreAnimacion(){
		// redefinir por subclase
		return "parado";
	}*/
	alIniciar(){
		if(pilas.escena_actual().estado == undefined){
			pilas.escena_actual().estado = new SinEstado();
		}
	}

	alTerminarAnimacion(){
			pilas.escena_actual().estado.realizarTransicion(this.argumentos['idComportamiento'],this)
	}

	debeEjecutarse(){
		return pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta'])
			.some(objeto => objeto.colisiona_con(this.receptor));
	}

	ejecutarse(){
		if(this.debeEjecutarse()){
			this.metodo(pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta']).filter(objeto => objeto.colisiona_con(this.receptor))[0]);
		}else{
			throw new ActividadError(this.argumentos['mensajeError']);
		}
	}

	metodo(objetoColision){
						//redefinir por subclase
	}
}

class DesencadenarAnimacionDobleSiColiciona extends ComportamientoColision{
		metodo(objetoColision){
			this.receptor.cargarAnimacion(this.argumentos['idAnimacionReceptor']);
			objetoColision.cargarAnimacion(this.argumentos['idAnimacion']);
		}
}


class DesencadenarAnimacionSiColiciona extends ComportamientoColision{
	metodo(objetoColision){
		objetoColision.cargarAnimacion(this.argumentos['idAnimacion']);
	}
}

class DesencadenarHabilidadSiColiciona extends ComportamientoColision{
	metodo(objetoColision){
		objetoColision.aprender(this.argumentos['Habilidad'],this.argumentos['argumentosHabilidad'])
	}
}


class MorderPorEtiqueta extends ComportamientoColision {
    metodo(objetoColision){
		objetoColision.cargarAnimacion("mordida");
    }
}

class EncenderPorEtiqueta extends ComportamientoColision{
	metodo(objetoColision){
		objetoColision.cargarAnimacion("prendida");
	}
}
