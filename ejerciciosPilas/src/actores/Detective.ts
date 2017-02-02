/// <reference path="ActorAnimado.ts"/>

class Detective extends ActorAnimado {
    constructor(x = 0, y = 0) {
        super(x, y, {grilla: 'detective.png', cantColumnas:1});
        this.definirAnimacion("parado", [0], 4, true);
    }

    private obtenerActorBajoLaLupa() {
      return pilas.obtener_actores_con_etiqueta("Sospechoso").filter(s => s.colisiona_con(this))[0];
    }

    public colisionaConElCulpable() {
      let sospechoso = this.obtenerActorBajoLaLupa();

      if (sospechoso.tieneDisflazPuesto) {
        throw new ActividadError("No puedo saber si es el culpable, no lo he interrogado antes.");
      }

      return sospechoso.esCulpable();
    }
}
