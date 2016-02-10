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

	configurarVerificaciones() {
		var mensajeError = this.argumentos['mensajeError'] || "¡Acá no hay " + this.hacerLegible(this.argumentos['etiqueta']) + "!";
		this.verificacionesPre.push(new Verificacion(() => this.colisiona(), mensajeError));
	}

	postAnimacion() {
		var objetoTocado = this.objetoTocado();
		if (this.argumentos['animacionColisionado']) objetoTocado.cargarAnimacion(this.argumentos['animacionColisionado']);
		if (this.argumentos['comportamientoAdicional']) objetoTocado.hacer_luego(this.argumentos['comportamientoAdicional'],this.argumentos['argumentosComportamiento']);
		this.metodo(objetoTocado);
	}

	colisiona() {
		return pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta'])
			.some(objeto => objeto.colisiona_con(this.receptor));
	}

	objetoTocado(){
		return pilas.obtener_actores_con_etiqueta(this.argumentos['etiqueta']).filter(objeto => objeto.colisiona_con(this.receptor))[0];
	}

	hacerLegible(etiqueta){
		return etiqueta.toLowerCase().split("animada")[0].split("animado")[0];
	}

	metodo(objetoColision){
						//redefinir por subclase
	}
}

class DesencadenarAnimacionSiColisiona extends ComportamientoColision{
	metodo(objetoColision){
		objetoColision.cargarAnimacion(this.argumentos['animacionColisionado']);
	}
}

class DesencadenarComportamientoSiColisiona extends ComportamientoColision{
	metodo(objetoColision){
		objetoColision.hacer_luego(this.argumentos['comportamiento'],this.argumentos['argumentosComportamiento'])
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
	configurarVerificaciones() {
		super.configurarVerificaciones();
		this.verificacionesPre.push(
			new Verificacion(() => this.estaApagada(), "¡Ya está " + this.nombreProximaAnimacion() + "!"));
	}
	estaApagada(){
		return this.objetoTocado().nombreAnimacionActual() != this.nombreProximaAnimacion();
	}
}

class MorderPorEtiqueta extends EncenderPorEtiqueta {
    nombreProximaAnimacion() {
		return "mordida";
    }
}
