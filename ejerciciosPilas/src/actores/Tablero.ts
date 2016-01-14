/*Implementa un tablero, que tiene "nombre de equipo" y "puntaje"*/
/*Notar que aumentar puede tomar valores negativos o positivos*/
/* Para usarlo, hay que construirlo y setearle un observado
ver clase "observado" */

class Tablero extends ActorAnimado{
  nombre;
  puntaje;
  observado;
  atributoObservado;

  constructor(x,y,argumentos){
    super(x, y, {grilla: argumentos.imagen || 'placacontar.png', cantColumnas:1, cantFilas: 1});

    this.atributoObservado = argumentos.atributoObservado || 'cantidad';
    this.nombre=new Texto(x,y,argumentos.texto,(argumentos.colorNombre||"black"));
    this.nombre.setZ(this.z - 1);

    this.puntaje=new Puntaje(
        this.nombre.derecha + (argumentos.separacionX || 10),
        this.nombre.y + (argumentos.separacionY || 0),
        argumentos.valorInicial || 0,
        argumentos.colorPuntaje || "black");
    this.puntaje.setZ(this.z - 2);

}


  dameValor(){
    this.puntaje.obtener();
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
    this.setearValor(observado[this.atributoObservado]);
  }


}
