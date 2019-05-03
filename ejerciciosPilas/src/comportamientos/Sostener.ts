/// <reference path="ComportamientoConEtiqueta.ts"/>

/*
Este comportamiento Agarra al objeto y refleja en un contador
el valor.
Argumentos adicionales al comportamiento colision: puedoSostenerMasDeUno (por defecto es falso)
*/
class Sostener extends InteractuarPorEtiqueta {

  preAnimacion() {
    super.preAnimacion();
    this.argumentos.nombreAnimacion = this.argumentos.nombreAnimacion || "recoger";
  }

  protected alInteractuar(): void {
    // TODO: Habría que separarlo en dos comportamientos, Tomar por un lado, Contar por el otro.
    var objetoAgarrado = this.interactuado().clonar()
    objetoAgarrado.escala = this.interactuado().escala
    objetoAgarrado.y = this.receptor.y
    objetoAgarrado.x = this.receptor.subactores[0].derecha - (this.receptor.subactores[0].ancho / 4)
    this.receptor.agregarSubactor(objetoAgarrado)
    objetoAgarrado.cargarAnimacion("correr") // porque tiene que cargar la misma imagen que va a usar al moverse

    if (objetoAgarrado.disminuir) objetoAgarrado.disminuir('cantidad', 1)
    if (!this.interactuado()['cantidad']) this.interactuado().eliminar()

  }

  configurarVerificaciones() {
    super.configurarVerificaciones();
    this.verificacionesPre.push(new Verificacion(() => this.puedoSostener(), "No puedo sostener dos cosas a la vez..."));
  }

  puedoSostener() {
    return this.argumentos.puedoSostenerMasDeUno || !this.receptor.tieneAlgoEnLaMano();
  }
}

class Soltar extends InteractuarPorEtiqueta {

  protected alInteractuar(): void {

    if (this.argumentos.queSoltar) {
      this.receptor.eliminarSubactor(this.argumentos.queSoltar)
    }

    else {
      this.receptor.eliminarUltimoSubactor();
    }

  }

  configurarVerificaciones() {
    super.configurarVerificaciones();
    const mensajeError: string = "No tengo " + (this.argumentos.queSoltar ? this.argumentos.queSoltar : "nada") + " en la mano"
    this.verificacionesPre.push(new Verificacion(() => this.sostieneLoQueCorresponde(), mensajeError));
  }

  sostieneLoQueCorresponde() {
    return this.argumentos.queSoltar ?
      this.receptor.tieneEnLaMano(this.argumentos.queSoltar) :
      this.receptor.tieneAlgoEnLaMano();
  }

}
