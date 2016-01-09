/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/HeroeAnimado.ts"/>
/// <reference path = "../actores/CofreAnimado.ts"/>
/// <reference path = "../actores/LlaveAnimado.ts"/>
/// <reference path = "../actores/MagoAnimado.ts"/>
/// <reference path = "../actores/CaballeroAnimado.ts"/>
/// <reference path = "../actores/UnicornioAnimado.ts"/>
/// <reference path = "../habilidades/AvisaAlSalirDePantalla.ts"/>
/// <reference path = "../comportamientos/MovimientosEnCuadricula.ts"/>
/// <reference path = "../comportamientos/ComportamientoDeAltoOrden.ts"/>
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
    unicornio;

    iniciar() {
        this.fondo = new Fondo('fondos.nubes.png',0,0);
        this.cuadricula = new Cuadricula(0,0,4,5,
            {alto: 400, ancho: 380},
            {grilla: 'casillas.violeta.png'});
        this.llave = new LlaveAnimado(0,0);
        this.cuadricula.agregarActor(this.llave,1,4)
        this.llave.escala = 1.5;
        this.llave.aprender(Flotar, {Desvio:5});

        this.cofre = new CofreAnimado(0,0);
        this.cuadricula.agregarActor(this.cofre,0,0);
        this.cofre.escala = 2;
        this.cofre.x += 7;

        this.caballero = new CaballeroAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.caballero,1,2);
        this.caballero.escala *= 1.5;
        
        this.mago = new MagoAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.mago, 3, 1);
        this.mago.escala *= 1.5;
        
        this.unicornio = new UnicornioAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.unicornio, 3, 4);
        this.unicornio.escala *= 1.5;

        this.automata = new HeroeAnimado(0,0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 3, 0);
        this.automata.escala *= 1.5;

        // se carga el estado inicial
        this.estado = new BuscandoLLaveState(this);
    }

    moverArriba() {
        this.automata.hacer_luego(MoverACasillaArriba);
    }

    moverIzquierda() {
        this.automata.hacer_luego(MoverACasillaIzquierda);
    }

    moverDerecha() {
        this.automata.hacer_luego(MoverACasillaDerecha);
    }

    moverAbajo() {
        this.automata.hacer_luego(MoverACasillaAbajo);
    }

    agarrarLlave() {
        this.automata.hacer_luego(ComportamientoDeAltoOrden, {'receptor': this, 'metodo': this.doAgarrarLlave, 'nombreAnimacion': 'recoger'});
    }

    abrirCofre() {
        this.automata.hacer_luego(ComportamientoDeAltoOrden, {'receptor': this, 'metodo': this.doAbrirCofre, 'nombreAnimacion': 'recoger'});
    }

    darSombrero() {
        this.automata.hacer_luego(ComportamientoDeAltoOrden, {'receptor': this, 'metodo': this.doDarSombrero, 'nombreAnimacion': 'recoger'});
    }

    atacarConEspada() {
        this.automata.hacer_luego(ComportamientoDeAltoOrden, {'receptor': this, 'metodo': this.doAtacarConEspada, 'nombreAnimacion': 'recoger'});
    }

    escaparEnUnicornio() {
        this.automata.hacer_luego(ComportamientoDeAltoOrden, {'receptor': this, 'metodo': this.doEscaparEnUnicornio, 'nombreAnimacion': 'recoger'});
    }

    doAgarrarLlave() {
    	this.estado.agarrarLlave();
    }

    doAbrirCofre() {
    	this.estado.abrirCofre();
    }

    doDarSombrero() {
    	this.estado.darSombrero();
    }

    doAtacarConEspada() {
    	this.estado.atacarConEspada();
    }

    doEscaparEnUnicornio() {
    	this.estado.escaparEnUnicornio();
    }

}

class MarEncantadoState {
    escena;

    constructor(escena) {
        this.escena = escena;
    }

    agarrarLlave() {
        throw new ActividadError("¡Aquí no está la llave!");
    }

    abrirCofre() {
        throw new ActividadError("¡Tengo que ir al cofre con la llave!");
    }

    darSombrero() {
        throw new ActividadError("¡Tengo que darle el sombrero al mago!");
    }

    atacarConEspada() {
        throw new ActividadError("¡Tengo que atacar con espada al caballero!");
    }

    escaparEnUnicornio() {
        throw new ActividadError("¡Tengo que salvar a la princesa y escapar!");
    }


}
class BuscandoLLaveState extends MarEncantadoState {
    constructor(escena) {
        super(escena);
    }

    agarrarLlave() {
        if (this.escena.automata.colisiona_con(this.escena.llave)) {
            this.escena.llave.eliminar();
            this.escena.estado = new BuscandoSombreroState(this.escena);
        } else {
            super.agarrarLlave();
        }
    }

}

class BuscandoSombreroState extends MarEncantadoState {
    constructor(escena) {
        super(escena);
    }

    abrirCofre() {
        if (this.escena.automata.colisiona_con(this.escena.cofre)) {
            this.escena.cofre.cargarAnimacion("abrir");
            this.escena.estado = new BuscandoEspadaState(this.escena);
        } else {
            super.abrirCofre();
        }
    }
}

class BuscandoEspadaState extends MarEncantadoState {
    constructor(escena) {
        super(escena);
    }

    darSombrero() {
        if (this.escena.automata.colisiona_con(this.escena.mago)) {
            this.escena.mago.eliminar();
            this.escena.estado = new IrALucharConCaballeroState(this.escena);
        } else {
            super.darSombrero();
        }
    }
}

class IrALucharConCaballeroState extends MarEncantadoState {
    constructor(escena) {
        super(escena);
    }

    atacarConEspada() {
        if (this.escena.automata.colisiona_con(this.escena.caballero)) {
            this.escena.caballero.eliminar();
            this.escena.estado = new RescatandoPrincesaState(this.escena);
        } else {
            super.atacarConEspada();
        }
    }
}

class RescatandoPrincesaState extends MarEncantadoState {
    constructor(escena) {
        super(escena);
    }

    escaparEnUnicornio() {
        if (this.escena.automata.colisiona_con(this.escena.unicornio)) {
            this.escena.unicornio.eliminar();
            this.escena.estado = new MarEncantadoState(this.escena);
        } else {
            super.escaparEnUnicornio();
        }
    }
}
