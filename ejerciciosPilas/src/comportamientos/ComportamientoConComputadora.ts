/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "ComportamientoColision.ts" />
/// <reference path = "SecuenciaAnimada.ts" />

class ComportamientoConComputadora extends ComportamientoColision {

    constructor(argumentos: any) {
        argumentos.etiqueta = 'CompuAnimada';
        argumentos.mensajeError = "No hay una computadora aquí";
        argumentos.nombreAnimacion = "escribir";
        super(argumentos);
    }

}

class PrenderComputadora extends ComportamientoConComputadora {

    constructor(argumentos: any) {
        argumentos.idTransicion = 'prender';
        argumentos.animacionColisionadoPost = "prendida";
        super(argumentos);
    }

    configurarVerificaciones(): void {
        super.configurarVerificaciones();
        this.verificacionesPre.push(new Verificacion(() => !this.objetoTocado().yaFuePrendida,
            "Esta computadora ya está prendida"))
    }

}

class ApagarComputadora extends ComportamientoConComputadora {

    constructor(argumentos: any) {
        argumentos.idTransicion = 'apagar';
        argumentos.animacionColisionadoPost = "parado";
        super(argumentos);
    }

    configurarVerificaciones(): void {
        super.configurarVerificaciones();
        this.verificacionesPre.push(new Verificacion(() => this.objetoTocado().yaFuePrendida,
            "Esta computadora ya está apagada"))
    }

}

class EscribirEnComputadora extends ComportamientoConComputadora {

    constructor(argumentos: any) {
        argumentos.nombreAnimacion = "escribir";
        super(argumentos);
    }


    metodo(objetoColision) {
        if (this.argumentos['idTransicion'] == 'escribirC') {
            objetoColision.cargarAnimacion("claveok");
        }
    }
}

class InstalarJuegoEnComputadora extends SecuenciaAnimada {

    constructor(argumentos: any) {
        argumentos.idTransicion = "instalar";
        argumentos.secuencia = [
            {
                comportamiento: "EscribirEnComputadora",
                argumentos: {}
            },
            {
                comportamiento: "EsperarAnimacionTocado",
                argumentos: {
                    etiqueta: "CompuAnimada",
                    nombreAnimacion: "instalando",
                    nombreAnimacionSiguiente: "yaInstalado"
                }
            },

        ];
        super(argumentos);
    }


}