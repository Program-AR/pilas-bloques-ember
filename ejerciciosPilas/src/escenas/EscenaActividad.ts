/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "Errores.ts"/>
/// <reference path = "../actores/ActorAnimado.ts"/>
/// <reference path = "EstadosDeEscena.ts"/>

// Esta escena sirve para todas las escenas de Ejercicios Pilas.
// Toda escena que represente una actividad debe heredar de aquí.

class EscenaActividad extends Base {
	estado : Estado;
	errorHandler = new ProductionErrorHandler(this);
	automata : ActorAnimado;

	actualizar() : void {
		try {
			super.actualizar();
		} catch (e) {
			if(e instanceof ActividadError){
				this.errorHandler.handle(e);
			} else {
				throw e;
			}
		}
	}

	estaResueltoElProblema() : Boolean {
		return this.estado.soyAceptacion();
	}

	cantidadObjetosConEtiqueta(etiqueta : String) : Number{
		return pilas.obtener_actores_con_etiqueta(etiqueta).length
	}
	personajePrincipal(): ActorAnimado {
		return this.automata;
	}

	maxZ() : Number {
		return this.stage.children[0].z;
	}

	minZ(): Number {
		return this.stage.children[this.stage.children.length - 1].z;
	}

	contarActoresConEtiqueta(etiqueta) : Number{
			return this.actores.filter(actor=>actor.tiene_etiqueta(etiqueta)).length;
	}





}
