/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "ActorAnimado.ts" />

class ActorCompuesto extends ActorAnimado {
	subactores;

	constructor(x,y,opciones){
		super(x, y, opciones);
		this.inicializarSubactores();
	}

	sanitizarOpciones(opciones){
		super.sanitizarOpciones(opciones);
		this.subactores = opciones.subactores;
	}

	inicializarSubactores() {
		this.subactores.forEach(actor =>
			actor.agregar_habilidad(ImitarAtributosNumericos , 
				{
					objeto_a_imitar: this,
					atributos: ['x', 'y', 'escala_x', 'escala_y'],
					setters: {'x': 'setX', 'y':'setY'} ,
				}));
	}

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
}
