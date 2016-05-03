/// <reference path = "EscenaActividad.ts" />
/// <reference path="../actores/CuadriculaMultiple.ts"/>
/// <reference path="../actores/ManzanaAnimada.ts"/>
/// <reference path="../actores/BananaAnimada.ts"/>
/// <reference path="../actores/MonoAnimado.ts"/>
/// <reference path="../actores/Tablero.ts"/>
/// <reference path="../actores/ObservadoAnimado.ts"/>

class ElMonoQueSabeContar extends EscenaActividad {
    fondo;
    cuadricula;
    tableros;

    iniciar() {
        this.fondo = new Fondo('fondos.selva.png',0,0);
        this.cuadricula = new CuadriculaMultipleColumnas(
            new DefinidorColumnasRandom(5, 6),
            0, -45,
            { separacionEntreCasillas: 5 },
            { alto: 40, ancho: 40, grilla: 'casillamediomono.png', cantColumnas: 1 })
        this.cuadricula.cambiarImagenInicio('casillainiciomono.png');
        this.cambiarImagenesFin();

        this.automata = new MonoAnimado(0, 0);
        this.cuadricula.agregarActorEnPerspectiva(this.automata, 0, 0);
        this.automata.escala *= 1.5;

        this.cuadricula.completarConObjetosRandom(new ConjuntoClases([ManzanaAnimada, BananaAnimada]),
          {condiciones:[
            function(fila,col,pmatrix){return fila!=0;},
            //no incluye en primera fila
            function(fila,col,pmatrix){return pmatrix[fila+1]!=undefined && pmatrix[fila+1][col]=='T';}
            //no incluye en ultima fila
          ]}
          );

        this.tableros = {};
        this.tableros.ManzanaAnimada = new Tablero(150,210,{texto:"Manzanas"});
        this.tableros.BananaAnimada = new Tablero(-150,210,{texto:"Bananas"});
    }

    cambiarImagenesFin(){
        this.cuadricula.cambiarImagenFin('casillafinalmono.png');
    }

    estaResueltoElProblema(){
      return this.cantidadObjetosConEtiqueta('BananaAnimada') === this.tableros.BananaAnimada.dameValor() &&
        this.cantidadObjetosConEtiqueta('ManzanaAnimada') === this.tableros.ManzanaAnimada.dameValor();
    }

}
