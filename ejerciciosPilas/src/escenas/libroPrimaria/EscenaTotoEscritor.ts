/// <reference path = "EscenaTotoLector.ts" />

class EscenaTotoEscritor extends EscenaTotoLector {
    manoQueEscribe : Actor;

    iniciar(){
        super.iniciar();
        this.manoQueEscribe = new ActorAnimado(0,0,{grilla: "manoToto.png"});
        this.cuadriculaLectura.agregarActor(this.manoQueEscribe,0,0,false);
        this.manoQueEscribe.escalarAAncho(100);
        this.manoQueEscribe.setY(this.manoQueEscribe.getY()+100);
    }

    construirCuadricula() : Cuadricula {
        return new Cuadricula(
            0, -150, this.mapaEscena.length, this.mapaEscena[0].length,
            { ancho: 400, alto: 70 }, { grilla: 'casilla.mono.contar.png' }
        );
    }

    construirCuadriculaLectura() : Cuadricula {
        return new Cuadricula(
            0, 50, 1, this.topeDeLetras,
            { alto: 60 }, { ancho: 40, grilla: 'invisible.png' }
        );
    }

    pathFondo(){
        return "fondo.totoEscritor.png";
    }
}


class EscribirTextoDadoEnOtraCuadricula extends EscribirTexto {

    iniciar(receptor){
        this.argumentos.texto = this.argumentos.texto || pilas.escena_actual().automata.caracterActual();
        this.argumentos.receptor = pilas.escena_actual().manoQueEscribe;
        super.iniciar(this.argumentos.receptor);
    }
}