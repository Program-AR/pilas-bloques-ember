/*Implementa un tablero, que tiene "nombre de equipo" y "puntaje"*/
/*Notar que aumentar puede tomar valores negativos o positivos*/
/* Para usarlo, hay que construirlo y setearle un observado
ver clase "observado" */

class Tablero extends ActorAnimado{
  nombre;
  puntaje;
  observado;

  constructor(x,y,argumentos){
    super(x, y, {grilla: argumentos.imagen, cantColumnas:1, cantFilas: 1});

    this.nombre=new Texto(x,y,argumentos.texto,(argumentos.colorNombre||"black"));

    this.puntaje=new Puntaje(x+(argumentos.separacionX||0),y+(argumentos.separacionY||0),argumentos.valorInicial||0,argumentos.colorPuntaje||"black");

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
