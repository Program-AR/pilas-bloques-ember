/// <reference path = "../escenas/Errores.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "ComportamientoAnimado.ts" />
/// <reference path = "../escenas/EstadosDeEscena.ts" />
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

	ejecutarse(){
		this.verificarCondicionesDeEjecucion();
		this.metodo(this.objetoTocado());
	}
	
	// Si se redefine, debe redefinirse también el método debeEjecutarse. 
	// Esto es para que pueda ofrecerse mayor granularidad al mostrar errores.
	verificarCondicionesDeEjecucion(){
		if (!this.colisiona()) throw new NoColisionaError(this.argumentos['mensajeError'], this.argumentos['etiqueta']);
	}
	// Si se redefine, debe redefinirse también el método verificarCondicionesDeEjecucion. 
	// Esto es para que pueda ofrecerse mayor granularidad al mostrar errores.
	debeEjecutarse() {
		return this.colisiona();
	}

	colisiona() {
		return pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta'])
			.some(objeto => objeto.colisiona_con(this.receptor));
	}

	objetoTocado(){
		return pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta']).filter(objeto => objeto.colisiona_con(this.receptor))[0];
	}

	metodo(objetoColision){
						//redefinir por subclase
	}
}

class NoColisionaError extends ActividadError{
	constructor(mensajeError :string, etiqueta :string) {
		var descripcion = etiqueta.toLowerCase().split("animada")[0].split("animado")[0];
		super(mensajeError || "¡Acá no hay " + descripcion + "!");
	}
}

class DesencadenarAnimacionSiColisiona extends ComportamientoColision{
	metodo(objetoColision){
		objetoColision.cargarAnimacion(this.argumentos['animacionColisionado']);
	}
}

class DesencadenarHabilidadSiColiciona extends ComportamientoColision{
	metodo(objetoColision){
		objetoColision.aprender(this.argumentos['Habilidad'],this.argumentos['argumentosHabilidad'])
	}
}

class EncenderPorEtiqueta extends ComportamientoColision{
	nombreAnimacion(){
		return "recoger";
	}
	metodo(objetoColision){
		objetoColision.cargarAnimacion(this.nombreProximaAnimacion());
	}
	nombreProximaAnimacion(){
		return "prendida"
	}
	verificarCondicionesDeEjecucion(){
		super.verificarCondicionesDeEjecucion();
		if (this.yaEstaPrendida()) throw new ActividadError("¡Ya está "+ this.nombreProximaAnimacion() +"!");
	}
	debeEjecutarse(){
		return super.debeEjecutarse() && !this.yaEstaPrendida();
	}
	yaEstaPrendida(){
		return this.objetoTocado().nombreAnimacionActual() == this.nombreProximaAnimacion();
	}
}

class MorderPorEtiqueta extends EncenderPorEtiqueta {
    nombreProximaAnimacion() {
		return "mordida";
    }
}
