/// <reference path = "../../dependencias/pilasweb.d.ts" />

class ModificarRotacionYAltura extends ComportamientoAnimado{
    receptor;

    

    iniciar(receptor) {
        super.iniciar(receptor);

    }

    actualizar() {

        if(super.actualizar()){
              this.receptor.y=this.argumentos['alturaIr'];
              this.receptor.rotacion=this.argumentos['rotacionIr'];
              return true;
          }


        return false;
    }


}
