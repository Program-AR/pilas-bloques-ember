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
  }

  // | margen | label | separacion | puntaje | margen |
  sanitizarArgumentosTablero(args){
    args.imagen =  args.imagen || 'placacontar.png';
    this.atributoObservado = args.atributoObservado || 'cantidad';
    this.colorTxtLabel = args.colorTxtLabel || "black";
    this.colorTxtPuntaje = args.colorTxtPuntaje || "black";
    this.separacionX = args.separacionX || 10;
    this.separacionY = args.separacionY || 0;
    this.margen = args.margen || 5;
  }

  buildLabel(argumentos){
    this.label = new Texto(
      0, // no importa, luego se actualiza
      this.y,
      argumentos.texto,
      this.colorTxtLabel);
    this.label.setZ(this.z - 1);
  }

  buildPuntaje(argumentos){
    this.puntaje = new Puntaje(
        0, // no importa, luego se actualiza
        this.label.y + this.separacionY,
        argumentos.valorInicial || 0,
        this.colorTxtPuntaje);
    this.puntaje.setZ(this.z - 2);
  }

  // | margen | label | separacion | puntaje | margen |
  updateWidth(){
    this.ancho = this.margen * 2 + this.separacionX + this.puntaje.ancho + this.label.ancho;
    this.label.izquierda = this.izquierda + this.margen;
    this.puntaje.izquierda = this.label.derecha + this.separacionX;
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

}
