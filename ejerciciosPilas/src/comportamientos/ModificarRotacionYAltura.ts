/// <reference path = "../../dependencias/pilasweb.d.ts" />
/// <reference path = "../comportamientos/AnimarSiNoEstoyYa.ts" />

class ModificarRotacionYAltura extends AnimarSiNoEstoyYa {

    postAnimacion() {
      super.postAnimacion();
      this.receptor.y=this.argumentos['alturaIr'];
      this.receptor.rotacion=this.argumentos['rotacionIr'];
    }

}
