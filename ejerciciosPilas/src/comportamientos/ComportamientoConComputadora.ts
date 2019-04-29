/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "Interactuar.ts" />
/// <reference path = "SecuenciaAnimada.ts" />
/// <reference path = "../actores/CompuAnimada.ts" />

class ComportamientoConComputadora extends Interactuar {

    constructor(argumentos: any) {
        argumentos.etiqueta = 'CompuAnimada'
        argumentos.mensajeError = "No hay una computadora aquí"
        argumentos.nombreAnimacion = "escribir"
        super(argumentos)
    }

    public computadoraInteractuada(): CompuAnimada {
        return this.interactuado() as CompuAnimada
    }

    protected alInteractuar(actor: ActorAnimado): void {

    }

}

class PrenderComputadora extends ComportamientoConComputadora {

    constructor(argumentos: any) {
        argumentos.idTransicion = 'prender'
        argumentos.animacionColisionadoPost = "prendida"
        super(argumentos)
    }

    public configurarVerificaciones(): void {
        super.configurarVerificaciones()
        this.verificacionesPre.push(new Verificacion(() => !this.computadoraInteractuada().estaPrendida(),
            "Esta computadora ya está prendida"))
    }

}

class ApagarComputadora extends ComportamientoConComputadora {

    constructor(argumentos: any) {
        argumentos.idTransicion = 'apagar'
        argumentos.animacionColisionadoPost = "parado"
        super(argumentos)
    }

    public configurarVerificaciones(): void {
        super.configurarVerificaciones()
        this.verificacionesPre.push(new Verificacion(() => this.computadoraInteractuada().estaPrendida(),
            "Esta computadora ya está apagada"))
    }

}

class EscribirEnComputadora extends ComportamientoConComputadora {

    constructor(argumentos: any) {
        argumentos.nombreAnimacion = "escribir"
        super(argumentos)
    }


    protected alInteractuar(actor: ActorAnimado): void {
        if (this.argumentos['idTransicion'] == 'escribirC') {
            actor.cargarAnimacion("claveok")
        }
    }
    
}

class InstalarJuegoEnComputadora extends SecuenciaAnimada {

    constructor(argumentos: any) {
        argumentos.idTransicion = "instalar"
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

        ]
        super(argumentos)
    }


}