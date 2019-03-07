/// <reference path = "../../../bower_components/pilasweb/dist/pilasweb.d.ts"/>
/// <reference path = "ComportamientoConVelocidad.ts"/>
/// <reference path = "../Direct.ts"/>

/**
 * @class MovimientoAnimado
 *
 * Argumentos:
 *    distancia: la distancia deseada de recorrer
 *    destino: alternativamente se puede proveer un objeto con x e y, que es el destino.
 *       NOTA: Si se proveen ambos distancia y destino, deben concordar, sino no se
 *              garantiza el comportamiento correcto del Movimiento.
 *    direccion: Sino, se puede proveer una direccion de movimiento. (instancia de Direc)
 *    velocidad: Es un porcentaje. 100 significa lo más rápido. Debe ser 1 ó más.
 *               Representa la cantidad de ciclos que efectivamente se ejecutan.
 *    cantPasos: Mayor cantidad de pasos implica mayor "definicion" del movimiento.
 *               Tambien tarda mas en completarse. Jugar tambien con la velocidad.
 *               Como esto juega con la animacion, es preferible no tocarlo.
 */
class MovimientoAnimado extends ComportamientoConVelocidad {
  vectorDeAvance: PuntoSimple;
  valoresFinales: any = {};

  nombreAnimacion(): string {
    return this.argumentos.nombreAnimacion || 'correr';
  }

  preAnimacion(): void {
    this.sanitizarArgumentosMovAn();
    super.preAnimacion();
    this.vectorDeAvance = this.valoresFinales.direccion.destinyFrom(
      { x: 0, y: 0 },
      this.valoresFinales.distancia / this.argumentos.cantPasos);
    this.receptor.suspenderHabilidadesConMovimiento();
    this.voltearSiCorresponde();
  }

  postAnimacion(): void {
    this.receptor.activarHabilidadesConMovimiento();
  }

  darUnPaso(): void {
    this.receptor.x += this.vectorDeAvance.x;
    this.receptor.y += this.vectorDeAvance.y;
  }

  setearEstadoFinalDeseado(): void {
    this.receptor.x = this.valoresFinales.destino.x;
    this.receptor.y = this.valoresFinales.destino.y;
  }

  sanitizarArgumentosMovAn(): void {
    this.argumentos.cantPasos = this.argumentos.cantPasos || 10; // MovimientoAnimado tiene su propio default de cantidad de pasos.
    this.sanitizarDistancia();
    this.sanitizarDireccion();
    this.valoresFinales.destino = this.argumentos.destino || this.calcularDestino();
    this.valoresFinales.voltearAlIrAIzquierda = this.argumentos.voltearAlIrAIzquierda !== false;
    this.corregirValoresSiHayObstaculo();
  }

  sanitizarDistancia(): void {
    this.valoresFinales.distancia = this.argumentos.distancia === 0 ? 0 : this.argumentos.distancia || this.calcularDistancia();
  }

  calcularDistancia(): number {
    if (!this.argumentos.destino) throw new ArgumentError("No se proporcionó una distancia ni un destino");
    return pilas.utils.distancia_entre_dos_actores(this.receptor, this.argumentos.destino);
  }

  sanitizarDireccion(): void {
    if (Array.isArray(this.argumentos.direccion) && this.argumentos.direccion.length === 2) {
      this.argumentos.direccion = new Direct(this.argumentos.direccion[0], this.argumentos.direccion[1]);
    }
    else if (this.argumentos.direccion !== undefined && !(this.argumentos.direccion instanceof Direct)) {
      throw new ArgumentError("La dirección debería ser una instancia de Direct o un array de dos números");
    }
    this.valoresFinales.direccion = this.argumentos.direccion || this.calcularDireccion();
  }

  calcularDireccion(): Direct {
    if (!this.argumentos.destino) throw new ArgumentError("No se proporcionó una dirección ni un destino");
    return new Direct(this.receptor, this.argumentos.destino);
  }

  calcularDestino(): PuntoSimple {
    return this.argumentos.direccion.destinyFrom(this.receptor, this.valoresFinales.distancia);
  }

  corregirValoresSiHayObstaculo(): void {
    if (this.hayObstaculo()) { // La idea es que si hay un obstáculo se pueda recorrer una distancia distinta.
      let distanciaOriginal = this.valoresFinales.distancia;
      this.valoresFinales.distancia = this.argumentos.distanciaConObstaculo || this.valoresFinales.distancia;
      this.argumentos.cantPasos = Math.ceil(this.argumentos.cantPasos * (this.valoresFinales.distancia / distanciaOriginal));
      this.valoresFinales.destino = this.calcularDestino();

      this.obstaculo().teEstoyPorColisionar(this.receptor);
    }
  }

  voltearSiCorresponde(): void {
    this.receptor.espejado = this.valoresFinales.voltearAlIrAIzquierda && this.vectorDeAvance.x < 0;
  }

  /**
   * Puede sobreescribirse en subclases.
   * Permite que haya obstáculos impidiendo un movimiento.
   * Si devuelve true, el movimiento se interrumpe y se produce una excepción.
   */
  hayObstaculo(): boolean {
    return false;
  }

  obstaculo() {
    return undefined;
  }

  configurarVerificaciones(): void {
    super.configurarVerificaciones();
    this.verificacionesPost.push(new Verificacion(
      () => !this.hayObstaculo(),
      "¡Hay un obstáculo!",
      "obstaculo"
    ));
  }

  destino(): PuntoSimple {
    return this.valoresFinales.destino;
  }
}
