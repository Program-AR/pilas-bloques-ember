/*

1. La clase implementa una matriz donde cada fila tiene una cantidad distinta de columnas.

2. Cada fila es una cuadricula

3. Se permite inicializar con tamaños random o con tamaños fijos.

4. También, dado un definidor de Columnas (ver clase de este archivo), permite inicializar
esta matriz con objetos de esos tipos de manera aleatoria.

5. Se provee el método posicionar objeto que reemplaza al agregarActor tradicional

6. Para un ejemplo de utilizacion ver ElMonoQueSabeContar.ts

*/


class CuadriculaMultiple /*extends ActorAnimado*/{
    filas;
    diccionarioFilaObjeto;
    nroFila;
    constructor(definidorColumnas){
    	//super(0,0,10);
        this.filas=[];
        this.inicializar(definidorColumnas)
    }

    private inicializar(definidorColumnas){
        while(definidorColumnas.hayProxColumnas()){
            this.filas.push(new Fila(this,definidorColumnas.nroFila(),definidorColumnas.dameProxColumnas()));
        }
    }

    public completarConObjetosRandom(arrayClases){
    	arrayClases = new conjuntoClases(arrayClases)
    	for (var i =0; i < this.filas.length ; i+=1){
    	this.filas[i].completarConObjetosRandom(arrayClases);
    	//this.filas.foreach(function(fila) {fila.completarConObjetosRandom(arrayClases)});
    	}
    }

    public avanzarFila(objeto){
        //TODO: deberia tener en cuenta que se puede ir del tablero????
        if (objeto.casillaActual().nroColumna==0){
            objeto.cuadricula.siguienteFila().agregarActor(objeto,0,0)
        }else{
            throw "No estoy al inicio de la fila"
        }
    }
    private dameFila(objeto){
        return this.diccionarioFilaObjeto[objeto];
    }
    public posicionarObjeto(objeto,i,j){
        //this.diccionarioFilaObjeto[objeto]=i;
        this.filas[i].agregarActor(objeto,0,j)
    }

}


class conjuntoClases {
     clases;

     constructor(clases){
         this.clases=clases;
     }

     dameUno(){
     	return new this.clases[Math.floor(Math.random() * this.clases.length)](0,0);
     }

}

class Fila extends Cuadricula{
    cantidadColumnas;
    cuadriculaMultiple;
    nroFila;
    constructor(cuadriculaMultipleP,nroFilaP,cantidadColumnasP){
        this.cantidadColumnas = cantidadColumnasP
        this.cuadriculaMultiple =cuadriculaMultipleP
        this.nroFila = nroFilaP
        super(-200+(this.cantidadColumnas/2)*40, 200-(55*this.nroFila), 1, this.cantidadColumnas,
            {alto: 40, ancho:40*this.cantidadColumnas},
            {grilla: 'casillaLightbot.png', cantColumnas:5})
    }
    /*
    El ancho seteado de esa manera permite que todas las casillas tengan el mismo tamano
    El x tiene que ver con lograr acomodar todas las casillas sobre el margen izquierdo

    */
    //TODO: reemplazar el 200 por algun valor independiente del navegador

    public siguienteFila(){

            if(this.existeSiguienteFila()){
                return this.cuadriculaMultiple.filas[this.nroFila+1];
            }else{
                throw "No hay siguiente fila"}

    }



    public existeSiguienteFila(){
        return this.nroFila<this.cuadriculaMultiple.filas.length-1
    }
    public completarConObjetosRandom(conjuntoClases){
    	// en la primer posicion no se debe guardar ningun objeto
        for (var index = 1; index < this.cantColumnas;index+=1){
            if (Math.random()<0.5) {
                this.agregarActor(conjuntoClases.dameUno(),0,index)
            }
        }
    }



}

class DefinidorColumnasDeUnaFila{
    index;
    tamanos;
    constructor(){
        this.index=0;
        this.tamanos=[];
    }

    dameProxColumnas(){
        var a = this.tamanos[this.index];
        this.index += 1;
        return a;
    }

    hayProxColumnas(){
        return this.index < this.tamanos.length
    }

    nroFila(){
        //comienza a numerar desde cero
        return this.index;
    }
}

class DefinidorColumnasRandom extends DefinidorColumnasDeUnaFila{
    constructor(filas,cantidadMaxColumnas){
        super();
        this.tamanos=Array.apply(null, Array(filas)).map(function (_, i) {return Math.floor((Math.random() * cantidadMaxColumnas) + 1);});
    }
}

class DefinidorColumnasFijo extends DefinidorColumnasDeUnaFila{
    constructor(filas,tamanos){
        super();
        this.tamanos = tamanos;
    }
}
