/*Implementa un tablero, que tiene "nombre de equipo" y "puntaje"*/
/*Notar que aumentar puede tomar valores negativos o positivos*/
/* Para usarlo, hay que construirlo y setearle un observado
ver clase "observado" */


class Tablero{
  nombre;
  puntaje;
  observado;
  /*Saco por ahora la observacion de algo, no lo necesito so far.*/
  constructor(x,y,argumentos){
    //this.observado=observadoP || undefined;


    this.nombre=new Texto(x,y,argumentos.texto,(argumentos.colorNombre||"black"));

    this.puntaje=new Puntaje(x + (argumentos.separacionX||0) ,y + (argumentos.separacionY||0),argumentos.valorInicial||0,(argumentos.colorPuntaje||"black"));
}


  dameValor(){
    this.puntaje.obtener();
  }

  aumentar(aumento){
    this.puntaje.aumentar(aumento);
  }

  setearValor(nuevoValor){
    if(nuevoValor<=this.puntaje.obtener()){
      this.puntaje.aumentar(-(this.puntaje.obtener()-nuevoValor))
      }else{
        this.puntaje.aumentar(nuevoValor-this.puntaje.obtener())
      }
  }
  tuObservadoCambio(observado){
    this.setearValor(observado.dameAtributo());
  }


}
