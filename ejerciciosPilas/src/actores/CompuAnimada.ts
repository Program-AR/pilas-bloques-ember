/// <reference path="ActorAnimado.ts"/>

class CompuAnimada extends ActorAnimado {

  private _estaPrendida: boolean

  constructor(x, y) {
    super(x, y, { grilla: 'compu_animada.png', cantColumnas: 8, cantFilas: 1 })
    this.definirAnimacion("parado", [0], 5, true)
    this.definirAnimacion("prendida", [1], 5)
    this.definirAnimacion("claveok", [2], 5)
    this.definirAnimacion("instalando", [3, 4, 5, 6, 7], 6)
    this.definirAnimacion("yaInstalado", [7], 1)
    this._estaPrendida = false
  }

  public cargarAnimacion(nombre: string): void {
    super.cargarAnimacion(nombre)

    if (nombre === "prendida") {
      this._estaPrendida = true
    }

  }

  public estaPrendida(): boolean {
    return this._estaPrendida;
  }

}
