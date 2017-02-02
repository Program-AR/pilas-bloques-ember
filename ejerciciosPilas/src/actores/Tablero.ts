/*Implementa un tablero, que tiene "nombre de equipo" y "puntaje"*/
/*Notar que aumentar puede tomar valores negativos o positivos*/
/* Para usarlo, hay que construirlo y setearle un observado
ver clase "observado" */

class Tablero extends ActorAnimado{
  label;
  puntaje;
  observado;
  atributoObservado;
  colorTxtLabel;
  colorTxtPuntaje;
  separacionY;
  separacionX;
  margen;



  constructor(x,y,argumentos){
    this.sanitizarArgumentosTablero(argumentos);
    super(x, y, {grilla: argumentos.imagen, cantColumnas:1, cantFilas: 1});

    this.buildLabel(argumentos);
    this.buildPuntaje(argumentos);
    this.updateWidth();
    this.updateHeight();
  }

  // label | separacion | puntaje     (el margen es igual tanto para el label como para el puntaje)
  sanitizarArgumentosTablero(args){
    args.imagen =  args.imagen || 'invisible.png';
    args.imagenLabel = args.imagenLabel || "PlacaContarGris.png";
    args.imagenPuntaje = args.imagenPuntaje || "PlacaContarNegra.png";
    this.atributoObservado = args.atributoObservado || 'cantidad';
    this.colorTxtLabel = args.colorTxtLabel || "black";
    this.colorTxtPuntaje = args.colorTxtPuntaje || "white";
    this.separacionX = args.separacionX || 0;
    this.separacionY = args.separacionY || 0;
    this.margen = args.margen || 6;
  }

  buildLabel(argumentos){
    this.label = new Texto(
      0, // no importa, luego se actualiza
      this.y,
      argumentos.texto,
      {color: this.colorTxtLabel,
        imagenFondo: argumentos.imagenLabel,
        margen: this.margen,
        });
    this.label.setZ(this.z - 1);
  }

  buildPuntaje(argumentos){
    this.puntaje = new Puntaje(
        0, // no importa, luego se actualiza
        this.label.y + this.separacionY,
        argumentos.valorInicial || 0,
        {color: this.colorTxtPuntaje,
          imagenFondo: argumentos.imagenPuntaje,
          margen: this.margen,
          });
    this.puntaje.setZ(this.z - 2);
  }

  // label | separacion | puntaje   (cada uno tiene su margen)
  updateWidth(){
    this.ancho = this.puntaje.ancho + this.separacionX + this.label.ancho;
    this.label.izquierda = this.izquierda;
    this.puntaje.izquierda = this.label.derecha + this.separacionX;
  }

  updateHeight(){
    this.alto = this.separacionY + this.label.alto;
    this.label.arriba = this.arriba;
    this.puntaje.arriba = this.label.arriba;
  }

  dameValor(){
    return this.puntaje.obtener();
  }

  aumentar(aumento){
    this.puntaje.aumentar(aumento);
  }

  setearValor(nuevoValor){
    if(nuevoValor <= this.puntaje.obtener()){
      this.puntaje.aumentar(-(this.puntaje.obtener() - nuevoValor));
    }else{
      this.puntaje.aumentar(nuevoValor - this.puntaje.obtener());
    }
  }

  tuObservadoCambio(observado){
    this.setearValor(this.leerObservado(observado));
    this.updateWidth();
  }

  leerObservado(observado){
    if (typeof (observado[this.atributoObservado]) === "function"){
      return observado[this.atributoObservado]();
    }
    return observado[this.atributoObservado];
  }

  setX(x){
    super.setX(x);
    this.updateWidth();
  }

  setY(y){
    super.setY(y);
    this.updateHeight();
  }

}
