/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "HabilidadAnimada.ts"/>

/*Si los grados de aumento son positivos gira para la derecha
caso contrario gira para la izquierda*/


class Rotar extends HabilidadAnimada {
  gradosDeAumentoStep
  constructor(receptor,argumentos) {
        super(receptor);
        this.gradosDeAumentoStep=argumentos['gradosDeAumentoStep']||1
    }

    actualizar() {
      this.receptor.rotacion += this.gradosDeAumentoStep
    }
}
