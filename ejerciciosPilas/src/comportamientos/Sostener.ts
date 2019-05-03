/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "Interactuar.ts" />

/*
Este comportamiento Agarra al objeto y refleja en un contador
el valor.
Argumentos adicionales al comportamiento colision: puedoSostenerMasDeUno (por defecto es falso)
*/
class Sostener extends Interactuar {

  preAnimacion() {
    super.preAnimacion();
    this.argumentos.nombreAnimacion = this.argumentos.nombreAnimacion || "recoger";
  }

  protected alInteractuar(): void {
    // TODO: Habría que separarlo en dos comportamientos, Tomar por un lado, Contar por el otro.

    var interactuado: any =  this.interactuado()
    var objetoAgarrado: any = interactuado.clonar()
    objetoAgarrado.escala = interactuado.escala
    objetoAgarrado.y = this.receptor.y
    objetoAgarrado.x = this.receptor.subactores[0].derecha - (this.receptor.subactores[0].ancho / 4)
    this.receptor.agregarSubactor(objetoAgarrado)
    objetoAgarrado.cargarAnimacion("correr") // porque tiene que cargar la misma imagen que va a usar al moverse

    if (interactuado.disminuir) interactuado.disminuir('cantidad',1)
    if (!interactuado['cantidad']) interactuado.eliminar()

  }

  configurarVerificaciones() {
    super.configurarVerificaciones();
    this.verificacionesPre.push(new Verificacion(() => this.puedoSostener(), "No puedo sostener dos cosas a la vez..."));
  }

  puedoSostener() {
    return this.argumentos.puedoSostenerMasDeUno || !this.receptor.tieneAlgoEnLaMano();
  }

}

class Soltar extends Interactuar {

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
    const mensajeError: string = "No tengo " + (this.argumentos.queSoltar ? this.hacerLegible(this.argumentos.queSoltar) : "nada") + " en la mano"
    this.verificacionesPre.push(new Verificacion(() => this.sostieneLoQueCorresponde(), mensajeError));
  }

  sostieneLoQueCorresponde() {
    return this.argumentos.queSoltar ?
      this.receptor.tieneEnLaMano(this.argumentos.queSoltar) :
      this.receptor.tieneAlgoEnLaMano();
  }

  hacerLegible(etiqueta) {
    return etiqueta ? super.hacerLegible(etiqueta) : "nada";
  }


}
