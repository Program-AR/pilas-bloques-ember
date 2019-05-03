/// <reference path="ActorAnimado.ts"/>

class Foco extends ActorAnimado {
  colores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(x = 0, y = 0) {
    super(x, y, { grilla: 'focos.color.png', cantColumnas: 13 });
    this.colores.forEach(nro =>
      this.definirAnimacion("color" + nro, [nro], 1));
    this.cargarAnimacion("color0");
  }

  cambiarColor() {
    this.cargarAnimacion("color" + this.siguienteNumero());
  }

  siguienteNumero() {
    var sgte = parseInt(this.nombreAnimacionActual().slice(5)) + 1;
    return sgte > 12 ? 0 : sgte;
  }
}
