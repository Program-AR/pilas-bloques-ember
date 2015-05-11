/*Implementa un tablero, que tiene "nombre de equipo" y "puntaje"*/
/*Notar que aumentar puede tomar valores negativos o positivos*/

class Tablero{
  nombre;
  puntaje;
  observado;
  /*Saco por ahora la observacion de algo, no lo necesito so far.*/
  constructor(x,y,texto,valorInicialPuntaje,observadop){
    //this.observado=observadoP || undefined;
    this.observado=observadop
    var colorNombre=undefined
    var colorPuntaje=undefined
    this.nombre=new Texto(x,y,texto,colorNombre);

    this.puntaje=new Puntaje(x + 10 ,y,valorInicialPuntaje,colorPuntaje);
    if(this.observado){
        this.observado.registrarObservador(this);
    }
}


  ubicarTexto(x,y){
    this.nombre.x=x;
    this.nombre.y=y;
  }

  ubicarPuntaje(x,y){
    this.puntaje.x=x;
    this.puntaje.y=y;
  }



  dameValor(){
    this.puntaje.obtener();
  }

  aumentar(aumento){
    this.puntaje.aumentar(aumento);
  }

  setearValor(nuevoValor){
    if(nuevoValor<=this.puntaje.obtener()){
      this.puntaje.aumentar(-(this.puntaje.obtener()-nuevoValor()))
      }else{
        this.puntaje.aumentar(nuevoValor-this.puntaje.obtener())
      }
  }

  tuObservadoCambio(){
    this.setearValor(this.observado.dameAtributo());
  }


}
