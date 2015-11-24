/// <reference path = "../escenas/Errores.ts" />
/// <reference path = "../habilidades/HabilidadAnimada.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>

class EncenderCompu extends Comportamiento {

  actualizar() {
    if (this.tocandoLuz()) {
      var casillaConLuz = this.getCasillaConLuz();
      casillaConLuz.agregar_habilidad(HabilidadAnimada, {nombreAnimacion: 'prendida'});
    } else {
      throw new ActividadError('¡Aquí no hay compu por prender!');
    }
    return true;
    }

    tocandoLuz() {
      return pilas.obtener_actores_con_etiqueta('CompuAnimada').some(objeto => objeto.colisiona_con(this.receptor));
    }

    getCasillaConLuz() {
      return pilas.obtener_actores_con_etiqueta('CompuAnimada').filter(objeto => objeto.colisiona_con(this.receptor))[0];
    }
}
