/// <reference path = "../../dependencias/pilasweb.d.ts"/>

/*Si los grados de aumento son positivos gira para la derecha
caso contrario gira para la izquierda*/


class Rotar extends Habilidad {
  gradosDeAumentoStep
  constructor(receptor,argumentos) {
        super(receptor);
        this.gradosDeAumentoStep=argumentos['gradosDeAumentoStep']||1
    }

    actualizar() {
      this.receptor.rotacion += this.gradosDeAumentoStep
    }




}
