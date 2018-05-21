/// <reference path = "EscenaActividad.ts" />
/// <reference path = "../actores/GatoAnimado.ts" />}

class ElGatoEnLaCalle extends EscenaActividad {

    iniciar() {
      this.fondo = new Fondo('fondo.gatoEnLaCalle.png',0,0);
      this.automata = new GatoAnimado(0,-150);
      this.construirFSM();
    }

    private construirFSM(){
      // ver https://github.com/Program-AR/pilas-bloques/issues/187
      var builder= new BuilderStatePattern(this, 'inicial',false);
      builder.agregarEstado('posCorrecta',false);
      builder.agregarEstado('semiDormido1',false);
      builder.agregarEstado('semiDormido2',false);
      builder.agregarEstado('dormido',false);
      builder.agregarEstado('semiDespierto1',false);
      builder.agregarEstado('semiDespierto2',false);
      builder.agregarEstado('despierto',false);
      builder.agregarEstado('saludado',false);
      builder.agregarEstado('noResuelve',false);
      builder.agregarEstadoAceptacion('fin');

      builder.agregarTransicion('inicial', 'posCorrecta', 'avanzar');
      builder.agregarTransicion('posCorrecta','semiDormido1','acostarse');
      builder.agregarTransicion('posCorrecta','semiDormido2','cerrarOjos');
      builder.agregarTransicion('semiDormido1','dormido','cerrarOjos');
      builder.agregarTransicion('semiDormido2','dormido','acostarse');
      builder.agregarTransicion('dormido','dormido','soniar');
      builder.agregarTransicion('dormido','semiDespierto1','abrirOjos');
      builder.agregarTransicion('dormido','semiDespierto2','levantarse');
      builder.agregarTransicion('semiDespierto1','despierto','levantarse');
      builder.agregarTransicion('semiDespierto2','despierto','abrirOjos');
      builder.agregarTransicion('despierto','saludado','saludar');
      builder.agregarTransicion('saludado','fin','volver');

      this.estado=builder.estadoInicial();
    }
}
