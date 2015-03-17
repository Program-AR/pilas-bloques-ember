
class ElRecolectorDeEstrellas extends Base {
    fondo;
    recolector;
    cuadricula;
    objetos;

    iniciar() {
        this.fondo = new Fondo('fondos/nubes.png',0,0);
        //this.recolector.izquierda = pilas.izquierda();
        var cantidadFilas=4
        var cantidadColumnas=5

        this.cuadricula = new Cuadricula(0,0,cantidadFilas,cantidadColumnas,
            {alto: 500},
            {grilla: 'casillaLightbot.png', 
            cantColumnas: 5})
        
        this.recolector = new RecolectorEstrellas(4,4);
        // La posición inicial pretende respectar el ejemplo
        this.recolector.setCuadricula(this.cuadricula,0,0);
        this.objetos=[];
        for (var fila=0;fila<cantidadFilas;fila++){
            for(var columna=1;columna<cantidadColumnas;columna++){
                var objeto= new Hueso(0,0);
                objeto.setCuadricula(this.cuadricula,fila,columna);
                this.objetos.push(objeto)
            }
        }

    }

    
    volverAlBordeIzquierdo(){
        this.recolector.hacer_luego(MoverTodoAIzquierda);
    }

    irArriba(){
        this.recolector.hacer_luego(MoverACasillaArriba);
    }
    
    irDerecha(){
        this.recolector.hacer_luego(MoverACasillaDerecha);
    }
    
    recogerEstrella(){
        this.recolector.hacer_luego(RecogerEstrella);
    }

    /*A partir de aqui no deberian ser bloques*/
    intentaronRecoger(){
        if (this.tocandoEstrella()) {
            var objeto = this.objetos.find(objeto => objeto.colisiona_con(this.recolector));
            objeto.eliminar();
        } else {
            this.recolector.decir("¡No hay estrella!")
        }
    }
    
    tocandoEstrella(){
        return this.objetos.some(objeto => objeto.colisiona_con(this.recolector));
    }
}