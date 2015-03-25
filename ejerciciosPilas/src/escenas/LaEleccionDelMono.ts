/// <reference path = "EscenaConObjetos.ts" />
/// <reference path = "../actores/Cuadricula.ts" />
/// <reference path = "../actores/BananaAnimada.ts" />
/// <reference path = "../actores/ManzanaAnimada.ts" />
/// <reference path = "../actores/MonoAnimado.ts" />}
/// <reference path = "../comportamientos/RecogerTipoEspecifico.ts" />}
/// <reference path = "../comportamientos/movimientosEnCuadricula.ts" />}

class LaEleccionDelMono extends EscenaConObjetos {
    fondo;
    cuadricula;
    mono;
    objetos = {'manzanas' : [] , 'bananas' : [] };
    esManzana;
    iniciar() {
    	this.fondo = new Fondo('fondos/nubes.png',0,0);
        var cantidadFilas=1
        var cantidadColumnas=2
        this.cuadricula = new Cuadricula(0,0,cantidadFilas,cantidadColumnas,
            {alto: 100},
            {grilla: 'casillaLightbot.png', 
            cantColumnas: 5})

        this.mono = new MonoAnimado(0,0);
        this.mono.setCuadricula(this.cuadricula,0,0);
        
		
		if (Math.random()< .5)  {
            this.agregarManzana();
        }else{
        	this.agregarBanana();

        }	    
    }

    agregarManzana(){
    	   this.objetos['manzanas'][0] = new ManzanaAnimada(0,0);
           this.objetos['manzanas'][0].setCuadricula(this.cuadricula,0,1);
    }

    agregarBanana(){
    	this.objetos['bananas'][0] = new BananaAnimada(0,0);
    	this.objetos['bananas'][0].setCuadricula(this.cuadricula,0,1);
    }

    comerManzana(){
        this.mono.hacer_luego(RecogerTipoEspecifico,{'tipoEspecifico' : 'manzanas', 'mensajeError' : 'No hay una manzana aqui' });
	}

	comerBanana(){
        this.mono.hacer_luego(RecogerTipoEspecifico,{'tipoEspecifico' : 'manzanas',  'mensajeError' : 'No hay una banana aqui' });
	}

	avanzar(){
        this.mono.hacer_luego(MoverACasillaDerecha);
	}


}