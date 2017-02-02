class Martillar extends Comportamiento {
  vecesRestantes;
  contador;

  iniciar(receptor) {
    super.iniciar(receptor);
    this.vecesRestantes = this.argumentos['veces'];

    var imagen = pilas.imagenes.cargar_grilla("cooperativista.trabajando.png", 3);
    this.receptor.imagen = imagen;
    this.contador = 0;
  }

  actualizar() {
    this.contador += 1;

    if (this.contador > 10) {
      this.contador = 0;
      
      var finaliza = this.receptor._imagen.avanzar();

      if (finaliza) {
        this.vecesRestantes -= 1;

        if (this.vecesRestantes === 0) {
          this.receptor.restaurar();
          return true;
        }
      }
    }

  }

}
