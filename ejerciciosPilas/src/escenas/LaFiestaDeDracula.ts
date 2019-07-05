/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/Frank.ts" />
/// <reference path = "../actores/Bruja.ts" />
/// <reference path = "../actores/Dracula.ts" />
/// <reference path = "../actores/Tito.ts" />
/// <reference path = "../actores/Murcielago.ts" />
/// <reference path = "../habilidades/Flotar.ts" />
/// <reference path = "../comportamientos/SecuenciaAnimada.ts" />
/// <reference path = "../comportamientos/Interactuar.ts" />


class LaFiestaDeDracula extends EscenaActividad {
  focos = [];
  bailarines = [];

  iniciar() {
    this.fondo = new Fondo('fondo.fiestadracula.png', 0, 0);
    this.cuadricula = new Cuadricula(0, 200, 1, 3,
      { alto: 100 },
      { grilla: 'invisible.png', cantColumnas: 1 });

    this.agregarAutomata();
    this.agregarFocos();
    this.agregarBailarines();
    this.crearEstado();
  }

  agregarAutomata() {
    this.automata = new Murcielago();
    this.cuadricula.agregarActor(this.automata, 0, 0, false);
    this.automata.y -= 120;
    this.automata.aprender(Flotar, { Desvio: 10 });
  }

  agregarFocos() {
    this.focos.push(new Foco());
    this.focos.push(new Foco());
    this.focos.push(new Foco());
    this.cuadricula.agregarActor(this.focos[0], 0, 0, false);
    this.cuadricula.agregarActor(this.focos[1], 0, 1, false);
    this.cuadricula.agregarActor(this.focos[2], 0, 2, false);
    this.focos.forEach(f => f.y -= 30);
  }

  agregarBailarines() {
    this.bailarines.push(new Frank(-150, -150));
    this.bailarines.push(new Bruja(-50, -150));
    var tito = new Tito(50, -150);
    tito.definirAnimacion("parado", [0], 6, true);
    this.bailarines.push(tito);
    this.bailarines.push(new Dracula(150, -150));
    this.bailarines.forEach(b => b.escala = 0.7);
  }

  private crearEstado() {
    var builder = new BuilderStatePattern(this, 'nadieBaila');
    builder.agregarEstadoAceptacion('todosBailando');
    builder.agregarTransicion('nadieBaila', 'todosBailando', 'empezarFiesta');
    this.estado = builder.estadoInicial();
  }
}

class CambiarColor extends Interactuar {

  sanitizarArgumentos() {
    this.argumentos.etiqueta = "Foco";
    super.sanitizarArgumentos();
  }

  protected alInteractuar(): void {
    (this.interactuado() as Foco).cambiarColor();
  }

}

class EmpezarFiesta extends SecuenciaAnimada {
  sanitizarArgumentos() {
    super.sanitizarArgumentos();
    var dracula = pilas.escena_actual().bailarines[pilas.escena_actual().bailarines.length - 1];
    this.argumentos.secuencia = [
      new Desaparecer({}),
      new ComportamientoConVelocidad({ receptor: dracula, nombreAnimacion: "aparecer" }),
    ];
  }

  configurarVerificaciones() {
    super.configurarVerificaciones();
    this.agregarVerificacionFoco(0, 5, "primer");
    this.agregarVerificacionFoco(1, 8, "segundo");
    this.agregarVerificacionFoco(2, 12, "tercer");
  }

  agregarVerificacionFoco(i, veces, ordinal) {
    this.verificacionesPre.push(
      new Verificacion(() => pilas.escena_actual().focos[i].nombreAnimacionActual() === "color" + veces,
        "¡El " + ordinal + " foco debe cambiarse de color " + veces + " veces!"));
  }

  postAnimacion() {
    super.postAnimacion();
    pilas.escena_actual().bailarines.forEach(b => b.cargarAnimacion("bailando"));
  }
}
