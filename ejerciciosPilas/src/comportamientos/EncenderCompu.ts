/// <reference path = "../escenas/Errores.ts" />
/// <reference path = "../habilidades/HabilidadAnimada.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>

class EncenderCompu extends Comportamiento {

  actualizar() {
    if (this.tocandoCompu()) {
      var compu = this.getCompu();
      compu.agregar_habilidad(HabilidadAnimada, {nombreAnimacion: 'prendida'});
    } else {
      throw new ActividadError('¡Aquí no hay compu por prender!');
    }
    return true;
    }

    tocandoCompu() {
      return pilas.obtener_actores_con_etiqueta('CompuAnimada').some(objeto => objeto.colisiona_con(this.receptor));
    }

    getCompu() {
      return pilas.obtener_actores_con_etiqueta('CompuAnimada').filter(objeto => objeto.colisiona_con(this.receptor))[0];
    }
}
