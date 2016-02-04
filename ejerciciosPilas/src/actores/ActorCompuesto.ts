/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "ActorAnimado.ts" />

class ActorCompuesto extends ActorAnimado {
	subactores;

	constructor(x,y,opciones){
		opciones.grilla = 'invisible.png';
		super(x, y, opciones);
		this.inicializarSubactores();
	}

	sanitizarOpciones(opciones){
		super.sanitizarOpciones(opciones);
		if(!opciones.subactores) throw "Se debe especificar una lista de subactores"
		this.subactores = opciones.subactores;
	}

	inicializarSubactores() {
		this.subactores.forEach(actor => this.apegarActor(actor));
	}

	agregarSubactor(actor){
		this.subactores.push(actor);
		this.apegarActor(actor)
	}

	private apegarActor(actor){
		actor.agregar_habilidad(ImitarAtributosNumericos2,
			{
				objeto_a_imitar: this,
				atributos: ['x', 'y', 'escala_x', 'escala_y'],
				setters: { 'x': 'setX', 'y': 'setY' },
			})
	}

	eliminarUltimoSubactor(){
		this.subactores.pop().eliminar();
	}

	cantSubactores(){
		return this.subactores.length;
	}

	tieneAlgoEnLaMano() {
		return this.cantSubactores() >= 2;
	}

	///////////////////////////////////////////////////////
	// A partir de acá son los métodos del composite polimórfico
	//////////////////////////////////////////////////////

	eliminar(){
		super.eliminar();
		this.subactores.forEach(actor => actor.eliminar());
	}

	cargarAnimacion(nombre) {
		this.subactores.forEach(actor => actor.cargarAnimacion(nombre));
	}

	avanzarAnimacion() {
		var parar = false;
		this.subactores.forEach(actor => parar = parar || actor.avanzarAnimacion());
		return parar;
	}

	nombreAnimacionActual(){
		return this.subactores[0].nombreAnimacionActual();
	}

	detenerAnimacion(){
		this.subactores.forEach(actor => actor.detenerAnimacion());
	}

	animar(){
		this.subactores.forEach(actor => actor.animar());
	}

	getAncho(){
		return this.subactores[0].getAncho();
	}

	getAlto() {
		return this.subactores[0].getAlto();
	}
}

class ImitarAtributosNumericos2 extends ImitarAtributosNumericos{
	implicaMovimiento(){
		return false;
	}
}