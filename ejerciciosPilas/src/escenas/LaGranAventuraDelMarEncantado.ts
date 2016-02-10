/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../comportamientos/Sostener.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/HeroeAnimado.ts"/>
/// <reference path = "../actores/CofreAnimado.ts"/>
/// <reference path = "../actores/LlaveAnimado.ts"/>
/// <reference path = "../actores/MagoAnimado.ts"/>
/// <reference path = "../actores/CaballeroAnimado.ts"/>
/// <reference path = "../actores/UnicornioAnimado.ts"/>
/// <reference path = "../actores/ActorCompuesto.ts" />
/// <reference path = "../actores/Princesa.ts" />

/**
 * @class LaGranAventuraDelMarEncantado
 *
 */
class LaGranAventuraDelMarEncantado extends EscenaActividad {
    estado;
    cuadricula;
    fondo;
    automata;
    cofre;
    llave;
    mago;
    caballero;
    princesa;
    unicornio;

    iniciar() {
        this.fondo = new Fondo('fondo.marEncantado.png',0,0);
        this.cuadricula = new Cuadricula(0,0,4,5,
            {alto: 376, ancho: 380},
            {grilla: 'invisible.png'});
        this.llave = new LlaveAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.llave, 1, 4)
        this.llave.escala *= 0.5;
        this.llave.aprender(Flotar, {Desvio:5});

        this.cofre = new CofreAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.cofre, 0, 0);
        this.cofre.x += 8;
        this.cofre.aprender(Flotar, { Desvio: 5 });

        this.caballero = new CaballeroAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.caballero,1,2);
        this.caballero.x += 19;
        this.caballero.escala *= 1.5;

        this.princesa = new Princesa(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.princesa, 1, 2);
        this.princesa.x -= 19;
        this.princesa.escala *= 1.5;

        this.mago = new MagoAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.mago, 3, 1);
        this.mago.escala *= 1.5;

        this.unicornio = new UnicornioAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.unicornio, 3, 4);
        this.unicornio.escala *= 1.5;

        this.automata = new ActorCompuesto(0, 0, { subactores: [new HeroeAnimado(0, 0)] });
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 3, 0);
        this.automata.escala *= 0.08;

        // se carga el estado inicial
        this.construirFSM();
    }

      private construirFSM(){
        var builder= new BuilderStatePattern('inicial');
        builder.agregarEstado('llaveEnMano');
        builder.agregarEstado('cofreAbierto');
        builder.agregarEstado('magoConSombrero');
        builder.agregarEstado('princesaRescatada');
        builder.agregarEstadoAceptacion('montandoUnicornio');

        builder.agregarTransicion('inicial','llaveEnMano','agarrarLlave');
        builder.agregarTransicion('llaveEnMano','cofreAbierto','abrirCofre');
        builder.agregarTransicion('cofreAbierto','magoConSombrero','darSombrero');
        builder.agregarTransicion('magoConSombrero','princesaRescatada','atacarConEspada');
        builder.agregarTransicion('princesaRescatada','montandoUnicornio','escapar');

        var estados = ['inicial','llaveEnMano','cofreAbierto','magoConSombrero','princesaRescatada','montandoUnicornio']

        for (let i = 0; i < estados.length; i++) {
          if(estados[i]!='llaveEnMano'){
            builder.agregarError(estados[i],'abrirCofre','Para abrir el cofre necesitás la llave.');
          }
          if(estados[i]!='cofreAbierto'){
            builder.agregarError(estados[i],'darSombrero','Para darle el sombrero al mago necesitás sacarlo del cofre.');
          }
          if(estados[i]!='magoConSombrero'){
            builder.agregarError(estados[i],'atacarConEspada','Para atacar al caballero, el mago debe darte la espada.');
          }
          if(estados[i]!='princesaRescatada'){
            builder.agregarError(estados[i],'escaparEnUnicornio','Para escapar en unicornio, debés rescatar a la princesa.');
          }
        }

        this.estado=builder.estadoInicial();
      }

}