/// <reference path = "../../dependencias/pilasweb.d.ts"/>
/// <reference path = "../actores/Cuadricula.ts"/>
/// <reference path = "../actores/HeroeAnimado.ts"/>
/// <reference path = "../actores/CofreAnimado.ts"/>
/// <reference path = "../actores/LlaveAnimado.ts"/>
/// <reference path = "../actores/MagoAnimado.ts"/>
/// <reference path = "../actores/CaballeroAnimado.ts"/>
/// <reference path = "../actores/UnicornioAnimado.ts"/>
/// <reference path = "../habilidades/AvisaAlSalirDePantalla.ts"/>
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts"/>


/**
 * @class LaGranAventuraDelMarEncantado
 * 
 */
class LaGranAventuraDelMarEncantado extends Base {
    estado;

    cuadricula;
    fondo;
    heroe;
    cofre;
    llave;
    mago;
    caballero;
    unicornio;
        
    iniciar() {
        this.fondo = new Fondo('fondos/nubes.png',0,0);

        this.cuadricula = new Cuadricula(0,0,4,5,
            {alto: 300},
            {grilla: 'casillaLightbot.png', 
            cantColumnas: 5});
        
        // se ubican los actores
        this.llave = new LlaveAnimado(0,0);
        this.llave.setCuadricula(this.cuadricula,1,4)

        this.cofre = new CofreAnimado(0,0);
        this.cofre.setCuadricula(this.cuadricula,0,0);

        this.caballero = new CaballeroAnimado(0,0);
        this.caballero.setCuadricula(this.cuadricula,1,2);

        this.mago = new MagoAnimado(0,0);
        this.mago.setCuadricula(this.cuadricula,3,1);

        this.unicornio = new UnicornioAnimado(0,0);
        this.unicornio.setCuadricula(this.cuadricula,3,4);

        this.heroe = new HeroeAnimado(0,0);
        this.heroe.setCuadricula(this.cuadricula,3,0);
        this.heroe.aprender(AvisaAlSalirDePantalla,{});

        // se carga el estado inicial
        this.estado = new BuscandoLLaveState(this);
    }

    moverArriba() {
        this.heroe.hacer_luego(MoverACasillaArriba);
    }

    moverIzquierda() {
        this.heroe.hacer_luego(MoverACasillaIzquierda);
    }

    moverDerecha() {
        this.heroe.hacer_luego(MoverACasillaDerecha);
    }

    moverAbajo() {
        this.heroe.hacer_luego(MoverACasillaAbajo);
    }

    agarrarLlave() {
        this.estado.agarrarLlave();
    }

    abrirCofre() {
        this.estado.abrirCofre();
    }

    darSombrero() {
        this.estado.darSombrero();
    }

    atacarConEspada() {
        this.estado.atacarConEspada();
    }

    escaparEnUnicornio() {
        this.estado.escaparEnUnicornio();
    }
}

class MarEncantadoState {
    escena;

    constructor(escena) {
        this.escena = escena;
    }

    agarrarLlave() { 
        this.escena.heroe.decir("¡Aquí no está la llave!");
    }
    
    abrirCofre() { 
        this.escena.heroe.decir("¡Tengo que ir al cofre con la llave!");
    }
    
    darSombrero() { 
        this.escena.heroe.decir("¡Tengo que darle el sombrero al mago!");
    }
    
    atacarConEspada() { 
        this.escena.heroe.decir("¡Tengo que atacar con espada al cabellero!");
    }
    
    escaparEnUnicornio() { 
        this.escena.heroe.decir("¡Tengo que salvar a la princesa y escapar!");
    }

}

class BuscandoLLaveState extends MarEncantadoState {
    constructor(escena) {
        super(escena);
    }

    agarrarLlave() { 
        if (this.escena.heroe.colisiona_con(this.escena.llave)) {
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
        if (this.escena.heroe.colisiona_con(this.escena.cofre)) {
            this.escena.cofre.eliminar();
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
        if (this.escena.heroe.colisiona_con(this.escena.mago)) {
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
        if (this.escena.heroe.colisiona_con(this.escena.caballero)) {
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
        if (this.escena.heroe.colisiona_con(this.escena.unicornio)) {
            this.escena.unicornio.eliminar();
            this.escena.estado = new MarEncantadoState(this.escena);
        } else {
            super.escaparEnUnicornio();
        }
    }
}

