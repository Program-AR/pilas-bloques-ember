/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerPorEtiqueta.ts" />}
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts" />}

class LaEleccionDelMono extends Base {
    fondo;
    cuadricula;
    mono;
    iniciar() {
    	this.fondo = new Fondo('fondos.nubes.png',0,0);
        var cantidadFilas=1
        var cantidadColumnas=2
        this.cuadricula = new Cuadricula(0,0,cantidadFilas,cantidadColumnas,
            {alto: 100},
            {grilla: 'casillaLightbot.png', 
            cantColumnas: 5})

        this.mono = new MonoAnimado(0,0);
        this.mono.setCuadricula(this.cuadricula,0,0);
        
		
		if (Math.random()< .5)  {
            this.agregar(ManzanaAnimada);
        }else{
            this.agregar(BananaAnimada);
        }	    
    }

    agregar(objeto){
        new objeto(0,0).setCuadricula(this.cuadricula,0,1);
    }

    comerManzana(){
        this.mono.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'ManzanaAnimada', 'mensajeError' : 'No hay una manzana aqui' });
	}

	comerBanana(){
        this.mono.hacer_luego(RecogerPorEtiqueta,{'etiqueta' : 'BananaAnimada',  'mensajeError' : 'No hay una banana aqui' });
	}

	avanzar(){
        this.mono.hacer_luego(MoverACasillaDerecha);
	}


}