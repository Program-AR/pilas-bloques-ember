/// <reference path="ActorAnimado.ts"/>

class CompuAnimada extends ActorAnimado {

  private _yaFuePrendida: boolean = false

  constructor(x, y) {
    super(x, y, { grilla: 'compu_animada.png', cantColumnas: 8, cantFilas: 1 })
    this.definirAnimacion("parado", [0], 5, true)
    this.definirAnimacion("prendida", [1], 5)
    this.definirAnimacion("claveok", [2], 5)
    this.definirAnimacion("instalando", [3, 4, 5, 6, 7], 6)
    this.definirAnimacion("yaInstalado", [7], 1)
  }

  cargarAnimacion(nombre) {
    super.cargarAnimacion(nombre)
    
    if(nombre === "prendida") {
      this._yaFuePrendida = true
    }

  }

  public yaFuePrendida(): boolean {
    return this._yaFuePrendida
  }

}
