/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "Interactuar.ts" />
/// <reference path = "SecuenciaAnimada.ts" />
/// <reference path = "../actores/CompuAnimada.ts" />

abstract class ComportamientoConComputadora extends Interactuar {

    constructor(argumentos: any) {
        argumentos.etiqueta = 'CompuAnimada'
        argumentos.mensajeError = "No hay una computadora aquí"
        argumentos.nombreAnimacion = "escribir"
        super(argumentos)
    }

    public computadoraInteractuada(): CompuAnimada {
        return this.interactuado() as CompuAnimada
    }

}

class PrenderComputadora extends ComportamientoConComputadora {

    constructor(argumentos: any) {
        argumentos.idTransicion = 'prender'
        argumentos.animacionInteractuadoAlFinal = "prendida"
        super(argumentos)
    }

    public configurarVerificaciones(): void {
        super.configurarVerificaciones()
        this.verificacionesPre.push(new Verificacion(() => !this.computadoraInteractuada().yaFuePrendida(),
            "Esta computadora ya está prendida"))
    }

}

class ApagarComputadora extends ComportamientoConComputadora {

    constructor(argumentos: any) {
        argumentos.idTransicion = 'apagar'
        argumentos.animacionInteractuadoAlFinal = "parado"
        super(argumentos)
    }

    public configurarVerificaciones(): void {
        super.configurarVerificaciones()
        this.verificacionesPre.push(new Verificacion(() => this.computadoraInteractuada().yaFuePrendida(),
            "Esta computadora ya está apagada"))
    }

}

class EscribirEnComputadora extends ComportamientoConComputadora {

    protected alInteractuar(): void {
        super.alInteractuar()
        if (this.argumentos['idTransicion'] == 'escribirC') {
            this.interactuado().cargarAnimacion("claveok")
        }
    }

}

class InstalarJuegoEnComputadora extends SecuenciaAnimada {

    constructor(argumentos: any) {
        argumentos.secuencia = [
            {
                comportamiento: "EscribirEnComputadora",
                argumentos: {
                    idTransicion: "instalar",
                }
            },
            {
                comportamiento: "EsperarAnimacionTocado",
                argumentos: {
                    etiqueta: "CompuAnimada",
                    nombreAnimacion: "instalando",
                    nombreAnimacionSiguiente: "yaInstalado"
                }
            },
        ]
        super(argumentos)
    }


}