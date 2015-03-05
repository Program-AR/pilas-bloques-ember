declare class Estudiante {
    habilidades: any;
    comportamientos: any;
    comportamiento_actual: any;
    constructor();
    aprender(clase_de_habilidad: any, argumentos?: any): string;
    agregar_habilidad(clase_de_habilidad: any, argumentos: any): void;
    actualizar_habilidades(): void;
    hacer(comportamiento: any, argumentos?: {}): void;
    hacer_luego(comportamiento: any, argumentos?: {}): void;
    actualizar_comportamientos(): void;
    _adoptar_el_siguiente_comportamiento(): void;
}
/**
 * @class Actor
 *
 * Representa un objeto visible en pantalla, algo que se ve y tiene posicion.
 *
 * {@img actores/actor.png}
 *
 * Un objeto Actor se tiene que crear siempre indicando una imagen. Si no
 * se especifica una imagen, se verá una pila de color gris cómo la que
 * está mas arriba.
 *
 * Una forma de crear el actor con una imagen es:
 *
 *     @example
 *     var protagonista = Actor("protagonista_de_frente.png");
 *
 * incluso, es equivalente hacer lo siguiente:
 *
 *     @example
 *     var imagen = pilas.imagenes.cargar("protagonista_de_frente.png");
 *     var protagonista = Actor(imagen);
 *
 * Luego, una vez que ha sido ejecutada la sentencia aparecerá
 * el nuevo actor para que puedas manipularlo. Por ejemplo
 * alterando sus propiedades:
 *
 *     @example
 *     protagonista.x = 100;
 *     protagonista.escala = 2;
 *     protagonista.rotacion = 30;
 *
 * Estas propiedades también se pueden manipular mediante
 * interpolaciones. Por ejemplo, para aumentar el tamaño del
 * personaje de 1 a 5 en 7 segundos:
 *
 *     @example
 *     protagonista.escala = 1;
 *     protagonista.escala = [5];
 *
 * Si quieres que el actor sea invisible, un truco es crearlo
 * con la imagen ``invisible.png``:
 *
 *     @example
 *     invisible = pilas.actores.Actor('invisible.png');
 *
 */
declare class Actor extends Estudiante {
    sprite: any;
    _imagen: any;
    vivo: any;
    radio_de_colision: any;
    id: any;
    figura: any;
    _espejado: any;
    callbacks_cuando_hace_click: any;
    callbacks_cuando_mueve_mouse: any;
    etiquetas: any;
    evto_se_movio: any;
    constructor(imagen: any, x: any, y: any, atributos?: {});
    getClassName(): string;
    iniciar(): void;
    tiene_fisica(): boolean;
    private _crear_sprite();
    eliminar(): void;
    z: any;
    espejado: any;
    x: any;
    y: any;
    centro: any[];
    centro_x: any;
    centro_y: any;
    escala_x: any;
    escala_y: any;
    escala: any;
    rotacion: any;
    transparencia: number;
    ancho: number;
    alto: number;
    imagen: any;
    izquierda: number;
    derecha: number;
    arriba: any;
    abajo: number;
    ejecutar_callbacks_clicks(): void;
    ejecutar_callbacks_over(): void;
    cuando_hace_click: any;
    cuando_mueve_mouse: any;
    recibir(evento: any, tipo: any): void;
    _cuando_hace_click(click: any): void;
    _cuando_mueve_mouse(evento: any): void;
    /**
     * @method colisiona_con_un_punto
     *
     * Determina si un punto colisiona con el area del actor.
     */
    colisiona_con_un_punto(x: any, y: any): boolean;
    decir(mensaje: any): void;
    imitar(actor_o_figura: any): void;
    pre_actualizar(): void;
    actualizar(): void;
    colisiona_con(otro_actor: any): any;
    esta_fuera_de_la_pantalla(): boolean;
    tiene_etiqueta(etiqueta: any): boolean;
}
declare class Aceituna extends Actor {
    cuadro_normal: any;
    cuadro_reir: any;
    cuadro_burlar: any;
    cuadro_gritar: any;
    constructor(x: any, y: any);
    normal(): void;
    reir(): void;
    gritar(): void;
    burlarse(): void;
    saltar(): void;
}
declare class Bomba extends Actor {
    paso: any;
    constructor(x: any, y: any);
    actualizar(): void;
}
declare class Nave extends Actor {
    paso: any;
    teclado_habilitado: any;
    enemigos: any;
    constructor(x: any, y: any);
    habilitar_teclado(): string;
    actualizar(): void;
    disparar(): string;
    avanzar(velocidad: any): void;
    definir_enemigos(enemigos: any): string;
}
declare class Explosion extends Actor {
    paso: any;
    constructor(x: any, y: any);
    actualizar(): void;
}
declare class Proyectil extends Actor {
    paso: any;
    enemigos: any;
    constructor(x: any, y: any, atributos: any);
    actualizar(): void;
    analizar_colisiones(): void;
}
declare class Piedra extends Actor {
    dx: any;
    dy: any;
    constructor(x: any, y: any, tamano: any, dx: any, dy: any);
    actualizar(): void;
    empujar(dx: any, dy: any): string;
    clonar(veces: any): string;
    obtener_tamano_al_azar(): string;
}
declare class Eje extends Actor {
    constructor(x: any, y: any);
}
declare class Maton extends Actor {
    paso: any;
    cuadros: any;
    direccion: any;
    velocidad: any;
    animar: any;
    obstaculos: any;
    teclado_habilitado: any;
    constructor(x: any, y: any);
    actualizar(): void;
    iniciar_animacion(): void;
    detener_animacion(): void;
    avanzar_animacion(): void;
    mover(x: any, y: any): void;
    puede_moverse_a(x: any, y: any): boolean;
    caminar_arriba(pasos: any): string;
    caminar_abajo(pasos: any): string;
    caminar_izquierda(pasos: any): string;
    caminar_derecha(pasos: any): string;
    saludar(): string;
    habilitar_teclado(): string;
    inspeccionar(): string;
}
declare class Globo extends Actor {
    mensaje: any;
    actor_texto: any;
    constructor(x: any, y: any, mensaje: any);
    eliminar(): void;
}
declare class Texto extends Actor {
    s: any;
    container: any;
    texto: any;
    color: any;
    sprite_texto: any;
    constructor(x: any, y: any, texto: any, color: any);
    crear_texto(): void;
    eliminar_texto(): void;
    eliminar(): void;
    escala_x: any;
    escala_y: any;
    escala: any;
}
declare class Bloque extends Actor {
    constructor(x: any, y: any, nombre_imagen: any);
}
declare class Manzana extends Actor {
    constructor(x: any, y: any);
}
declare class Cofre extends Actor {
    paso: any;
    esta_abierto: any;
    constructor(x: any, y: any);
    abrir(): void;
    actualizar(): void;
}
declare class Llave extends Actor {
    constructor(x: any, y: any);
}
declare class Caja extends Actor {
    constructor(x: any, y: any);
}
declare class Cesto extends Actor {
    figura1: any;
    figura2: any;
    figura3: any;
    constructor(x?: number, y?: number);
}
declare class Pelota extends Actor {
    figura: any;
    constructor(x: any, y: any);
    empujar(dx: any, dy: any): string;
    posicion(x: any, y: any): void;
}
declare class Zanahoria extends Actor {
    cuadro_normal: any;
    cuadro_sonrie: any;
    constructor(x: any, y: any);
    normal(): void;
    sonreir(): void;
    saltar(): void;
    decir(): void;
}
declare class Boton extends Actor {
    ruta_normal: any;
    ruta_press: any;
    ruta_over: any;
    funciones_normal: any;
    funciones_press: any;
    funciones_over: any;
    estado: any;
    constructor(x: any, y: any, ruta_normal?: string, ruta_press?: string, ruta_over?: string);
    recibir(evento: any, tipo: any): void;
    conectar_normal(funcion: any, args?: any): void;
    conectar_presionado(funcion: any, args?: any): void;
    conectar_sobre(funcion: any, args?: any): void;
    desconectar_normal_todo(): void;
    desconectar_presionado_todo(): void;
    desconectar_sobre_todo(): void;
    desconectar_normal(funcion: any, args: any): void;
    desconectar_presionado(funcion: any, args: any): void;
    desconectar_sobre(funcion: any, args: any): void;
    ejecutar_funciones_normal(): void;
    ejecutar_funciones_press(): void;
    ejecutar_funciones_over(): void;
    activar(): void;
    desactivar(): void;
    pintar_normal(): void;
    pintar_presionado(): void;
    pintar_sobre(): void;
    detectar_clic(click: any): void;
    detectar_movimiento(evento: any): void;
}
declare class Puntaje extends Texto {
    valor: any;
    constructor(x: any, y: any, puntaje: any, color: any);
    aumentar(aumento: any): void;
    obtener(): any;
}
declare class Mono extends Actor {
    image_normal: any;
    image_smile: any;
    image_shout: any;
    sound_smile: any;
    sound_shout: any;
    constructor(x: any, y: any);
    sonreir(): void;
    gritar(): void;
    normal(): void;
    decir(mensaje: any): void;
    saltar(): void;
}
declare class Banana extends Actor {
    constructor(x?: number, y?: number);
    cerrar(): void;
    abrir(): void;
}
declare class Tortuga extends Actor {
    anterior_x: any;
    anterior_y: any;
    pizarra: any;
    lapiz_bajo: any;
    _color: any;
    constructor(x?: number, y?: number, dibuja?: boolean);
    avanzar(pasos: any): void;
    girarderecha(delta: any): void;
    girarizquierda(delta: any): void;
    actualizar(): void;
    bajalapiz(): void;
    subelapiz(): void;
    crear_poligono(lados?: number, escala?: number, sentido?: number): void;
    crear_circulo(radio: any, sentido?: number): void;
    color: any;
}
declare class Pizarra extends Actor {
    container: any;
    lienzo: any;
    _ancho: any;
    _alto: any;
    constructor(x?: number, y?: number);
    dibujar_punto(x: any, y: any, color?: any): void;
    linea(x: any, y: any, x2: any, y2: any, color?: any, grosor?: number): void;
    rectangulo(x: any, y: any, ancho: any, alto: any, color?: any, relleno?: any, grosor?: number): void;
    poligono(puntos: any, color?: any, grosor?: number): void;
    limpiar(): void;
    pintar(color: any): void;
}
declare class Pingu extends Actor {
    paso: any;
    cuadros_correr: any;
    saltando: any;
    constructor(x?: number, y?: number);
    actualizar(): void;
    puede_saltar(): void;
    mover(x: any, y: any): void;
    animacion_correr(): void;
    detener_animacion(): void;
}
declare class Alien extends Actor {
    sombra: any;
    limitar_movimientos: any;
    sonido_blabla: any;
    cuando_busca_recoger: any;
    constructor(x?: number, y?: number);
    iniciar(): void;
    decir(mensaje: any): void;
    super_decir(mensaje: any): void;
    actualizar(): void;
    avanzar_animacion(): any;
    ir_derecha(): void;
    ir_izquierda(): void;
    ir_arriba(): void;
    ir_abajo(): void;
    esperar(tiempo?: number): void;
    detener(): void;
    recoger(): void;
}
declare class Movimiento {
    receptor: any;
    argumentos: any;
    tiempo: any;
    cantidad: any;
    _contador_de_tiempo: any;
    _velocidad: any;
    constructor(argumentos: any);
    iniciar(receptor: any): void;
    iniciar_animacion(): void;
    supero_el_tiempo(): boolean;
    al_terminar(): void;
}
declare class MoverHaciaDerecha extends Movimiento {
    iniciar_animacion(): void;
    actualizar(): boolean;
    realizar_movimiento(): void;
}
declare class MoverHaciaIzquierda extends MoverHaciaDerecha {
    iniciar_animacion(): void;
    realizar_movimiento(): void;
}
declare class MoverHaciaArriba extends MoverHaciaDerecha {
    iniciar_animacion(): void;
    realizar_movimiento(): void;
}
declare class MoverHaciaAbajo extends MoverHaciaDerecha {
    iniciar_animacion(): void;
    realizar_movimiento(): void;
}
declare class Esperar extends MoverHaciaDerecha {
    iniciar_animacion(): void;
    realizar_movimiento(): void;
}
declare class Recoger extends Movimiento {
    iniciar_animacion(): void;
    actualizar(): boolean;
}
declare class Hablar extends MoverHaciaDerecha {
    contador: any;
    iniciar_animacion(): void;
    realizar_movimiento(): void;
}
declare class AlienMarron extends Actor {
    sombra: any;
    limitar_movimientos: any;
    sonido_blabla: any;
    cuando_busca_recoger: any;
    constructor(x?: number, y?: number);
    iniciar(): void;
    decir(mensaje: any): void;
    super_decir(mensaje: any): void;
    actualizar(): void;
    avanzar_animacion(): any;
    ir_derecha(): void;
    ir_izquierda(): void;
    ir_arriba(): void;
    ir_abajo(): void;
    esperar(tiempo?: number): void;
    detener(): void;
    recoger(): void;
}
declare class Tuerca extends Actor {
    y_original: any;
    contador: any;
    sombra: any;
    constructor(x: any, y: any);
    actualizar(): void;
}
declare class Sombra extends Actor {
    constructor(x: any, y: any);
}
/**
 * @class Actores
 *
 * Módulo Actores
 * ==============
 *
 * Representa todos los actores conocidos en pilas-engine.
 */
declare class Actores {
    pilas: any;
    Aceituna: any;
    Actor: any;
    Bomba: any;
    Explosion: any;
    Nave: any;
    Proyectil: any;
    Piedra: any;
    Eje: any;
    Maton: any;
    Globo: any;
    Texto: any;
    Bloque: any;
    Manzana: any;
    Cofre: any;
    Llave: any;
    Caja: any;
    Cesto: any;
    Pelota: any;
    Zanahoria: any;
    Boton: any;
    Puntaje: any;
    Mono: any;
    Banana: any;
    Tortuga: any;
    Pizarra: any;
    Pingu: any;
    Alien: any;
    AlienMarron: any;
    Tuerca: any;
    Sombra: any;
    constructor(pilas: any);
}
/**
 * @class Camara
 *
 * Representa la cámara que visualiza el escenario y permite hacer movimientos
 * de pantalla.
 *
 * Esta clase también se encarga de transformar el sistema de referencia
 * entre coordenadas de pantalla y coordenadas de escenario.
 */
declare class Camara {
    escenario: any;
    centro_x: any;
    centro_y: any;
    constructor(escenario: any);
    x: any;
    y: any;
    zoom: any;
    /**
     * @method obtener_posicion_pantalla
     *
     * Convierte una posición del escenario de pilas al formato
     * de coordenadas del navegador.
     *
     * Por ejemplo, el punto (0, 0) es el centro del escenario para
     * pilas, pero el navegador lo interpreta como el punto (160, 120).
     */
    obtener_posicion_pantalla(x: any, y: any): {
        x: any;
        y: number;
    };
    /**
     * @method obtener_posicion_escenario
     *
     * Convierte una posición dada en un sistema de coordenadas
     * tradicional, en una posición de escenario, donde el punto (0, 0)
     * es el centro de la pantalla.
     */
    obtener_posicion_escenario(x: any, y: any): {
        x: number;
        y: number;
    };
    obtener_posicion(): {
        x: number;
        y: any;
    };
    convertir_de_posicion_relativa_a_fisica(x: any, y: any): {
        x: any;
        y: number;
    };
    convertir_de_posicion_fisica_a_relativa(x: any, y: any): {
        x: any;
        y: number;
    };
    obtener_area_visible(): {
        izquierda: number;
        derecha: any;
        arriba: any;
        abajo: number;
    };
}
declare class Colisiones {
    colisiones: any;
    constructor();
    agregar(grupo_a: any, grupo_b: any, funcion_a_llamar: any, parent?: any): void;
    verificar_colisiones(): void;
    _verificar_colisiones_en_tupla(tupla: any): void;
}
declare class colores {
    negro: any;
    blanco: any;
    rojo: any;
    verde: any;
    azul: any;
    gris: any;
    amarillo: any;
    magenta: any;
    cyan: any;
    grisclaro: any;
    grisoscuro: any;
    verdeoscuro: any;
    azuloscuro: any;
    naranja: any;
    rosa: any;
    violeta: any;
    marron: any;
    negro_transparente: any;
    blanco_transparente: any;
    rojo_transparente: any;
    verde_transparente: any;
    azul_transparente: any;
    gris_transparente: any;
    constructor();
}
/**
 * @class Comportamiento
 *
 * Representa una habilidad que un actor puede aprender.
 */
declare class Comportamiento {
    receptor: any;
    argumentos: any;
    constructor(argumentos: any);
    iniciar(receptor: any): void;
    actualizar(): void;
    eliminar(): void;
}
declare class AvanzarComoProyectil extends Comportamiento {
    velocidad: any;
    dx: any;
    dy: any;
    iniciar(receptor: any): void;
    actualizar(): void;
}
declare class Avanzar extends Comportamiento {
    pasos: any;
    velocidad: any;
    dx: any;
    dy: any;
    iniciar(receptor: any): void;
    actualizar(): boolean;
}
declare class Girar extends Comportamiento {
    angulo: any;
    tiempo: any;
    angulo_aux: any;
    iniciar(receptor: any): void;
    actualizar(): boolean;
}
declare class Saltar extends Comportamiento {
    cuando_termina: any;
    suelo: any;
    velocidad_inicial: any;
    velocidad: any;
    velocidad_aux: any;
    sonido_saltar: any;
    iniciar(receptor: any): void;
    actualizar(): boolean;
}
declare class Saltando extends Comportamiento {
    suelo: any;
    dy: any;
    cuando_termina: any;
    iniciar(receptor: any): void;
    actualizar(): boolean;
}
declare class Orbitar extends Comportamiento {
    punto_de_orbita_x: any;
    punto_de_orbita_y: any;
    radio: any;
    velocidad: any;
    direccion: any;
    angulo: any;
    iniciar(receptor: any): void;
    actualizar(): void;
    mover_astro(): void;
}
declare class OrbitarSobreActor extends Orbitar {
    actor: any;
    iniciar(receptor: any): void;
    actualizar(): void;
}
declare class CaminarBase extends Comportamiento {
    pasos: any;
    velocidad: any;
    iniciar(receptor: any): void;
    actualizar(): boolean;
    mover(): void;
}
declare class CaminaArriba extends CaminarBase {
    mover(): void;
}
declare class CaminaAbajo extends CaminarBase {
    mover(): void;
}
declare class CaminaIzquierda extends CaminarBase {
    mover(): void;
}
declare class CaminaDerecha extends CaminarBase {
    mover(): void;
}
/**
 * @class Secuencia
 *
 * Representa una secuencia de comportamientos que un actor realiza de forma ordenada.
 *
 * Espera una lista de comportamientos.
 */
declare class Secuencia extends Comportamiento {
    secuencia: any;
    comando_actual: any;
    reiniciar: any;
    iniciar(receptor: any): void;
    actualizar(): boolean;
}
/**
 * @class Alternativa
 *
 * Representa un if-then-else entre dos comportamientos. Se ejecuta uno u otro dependiendo de una condicion.
 *
 * Recibe como argumentos dos comportamientos de tipo Secuencia y una funcion booleana a evaluar.
 */
declare class Alternativa extends Comportamiento {
    rama_entonces: any;
    rama_sino: any;
    condicion: any;
    rama_elegida: any;
    ejecutado: any;
    iniciar(receptor: any): void;
    actualizar(): boolean;
}
/**
 * @class RepetirHasta
 *
 * Representa un bucle condicional que repite un comportamiento hasta que se cumple cierta condicion.
 *
 * Recibe como argumento un comportamiento de tipo Secuencia y una funcion booleana a evaluar.
 */
declare class RepetirHasta extends Comportamiento {
    ejecutado: any;
    secuencia: any;
    condicion: any;
    evaluar_condicion: any;
    iniciar(receptor: any): void;
    actualizar(): boolean;
}
/**
 * @class RepetirN
 *
 * Representa un bucle que repite una cierta cantidad de veces un comportamiento
 *
 * Recibe como argumento un comportamiento de tipo Secuencia y una funcion booleana a evaluar.
 */
declare class RepetirN extends Comportamiento {
    secuencia: any;
    cantidad: any;
    cantidad_actual: any;
    volver_a_evaluar: any;
    iniciar(receptor: any): void;
    actualizar(): boolean;
}
/**
 * @class CambiarAtributo
 *
 * Representa el cambio de un atributo del actor
 *
 * Recibe como argumento una funcion cuyo resultado sera guardado como valor del atributo
 */
declare class CambiarAtributo extends Comportamiento {
    nombre: any;
    funcion_valor: any;
    iniciar(receptor: any): void;
    actualizar(): boolean;
}
/**
 * @class ConstructorDePrograma
 *
 * Permite construir un comportamiento que representa un programa
 *
**/
declare class ConstructorDePrograma {
    stack_secuencias: any;
    constructor();
    empezar_secuencia(): void;
    hacer(comportamiento: any, argumentos: any): void;
    terminar_secuencia(): void;
    repetir_hasta(c: any): void;
    alternativa_si(c: any): void;
    alternativa_sino(c: any): void;
    repetirN(n: any): void;
    cambio_atributo(n: any, f: any): void;
    ejecutar(actor: any): void;
    obtener_programa(): any;
}
declare class Programa extends Comportamiento {
    programa: any;
    iniciar(receptor: any): void;
    actualizar(): boolean;
}
/**
 * @class Comportamientos
 *
 * Representa todos los comportamientos que puede hacer un actor en pilas-engine.
 */
declare class Comportamientos {
    Subir: any;
    CaminarBase: any;
    CaminaArriba: any;
    CaminaAbajo: any;
    CaminaIzquierda: any;
    CaminaDerecha: any;
    Orbitar: any;
    OrbitarSobreActor: any;
    Saltar: any;
    Girar: any;
    Avanzar: any;
    AvanzarComoProyectil: any;
    Saltando: any;
    Secuencia: any;
    Alternativa: any;
    RepetirHasta: any;
    RepetirN: any;
    ConstructorDePrograma: any;
    Programa: any;
    constructor();
}
/**
 * @class Control
 *
 * Representa un control de teclado sencillo.
 *
 * Este objeto permite acceder al estado del teclado usando atributos.
 *
 * Por ejemplo, con este objeto, para saber si el usuario está
 * pulsando el direccional hacia la izquierda puedes ejecutar::
 *
 *     @example
 *     if (pilas.escena_actual().control.izquierda) {
 *       console.log('Ha pulsado hacia la izquierda');
 *     }
 *
 * Es decir, si bien Control es una clase, no hace falta
 * instanciarla. Ya existe un objeto que se puede consultar bajo el
 * nombre ``pilas.escena_actual().control``.
 *
 * Entonces, una vez que tienes la referencia para consultar, los
 * atributos que tiene este objeto control son::
 *
 *     @example
 *     izquierda
 *     derecha
 *     arriba
 *     abajo
 *     boton
 *
 * Cada uno de estos atributos te pueden devolver true, o false,
 * indicando si el control está pulsado o no.
 */
declare class Control {
    izquierda: any;
    derecha: any;
    arriba: any;
    abajo: any;
    boton: any;
    constructor(escena: any);
    recibir(evento: any, tipo: any): void;
    cuando_pulsa_una_tecla(evento: any): void;
    cuando_suelta_una_tecla(evento: any): void;
}
declare class DepuradorDeshabilitado {
    modos: any;
    diccionario_modos: any;
    constructor();
    actualizar(): void;
    definir_modos(modos: any): void;
    eliminar_todos_los_modos(): void;
    obtener_modos(): any;
}
declare class ModoDeDepuracion {
    shape: any;
    container: any;
    grosor_linea: any;
    constructor();
    eliminar(): void;
    actualizar(): void;
}
declare class ModoRadiosDeColision extends ModoDeDepuracion {
    actualizar(): void;
}
declare class ModoArea extends ModoDeDepuracion {
    actualizar(): void;
}
declare class ModoPuntosDeControl extends ModoDeDepuracion {
    actualizar(): void;
}
declare class ModoFisica extends ModoDeDepuracion {
    actualizar(): void;
}
declare class ModoPosicion extends ModoDeDepuracion {
    text_coordenada: any;
    eje: any;
    constructor();
    private sobre_escribir_dibujado();
    eliminar(): void;
    actualizar(): void;
}
declare class escena {
    Base: any;
    Normal: any;
    constructor();
}
declare class Base {
    click_de_mouse: any;
    cuando_termina_click: any;
    mueve_mouse: any;
    actualiza: any;
    pulsa_tecla: any;
    suelta_tecla: any;
    fisica: any;
    stage: any;
    camara: any;
    control: any;
    actores: any;
    tareas: any;
    constructor();
    iniciar(): void;
    actualizar(): void;
    necesita_ordenar_actores(): boolean;
    ordenar_actores_por_valor_z(): void;
    agregar_actor(actor: any): void;
    eliminar_actor(actor: any): void;
    obtener_posicion_pantalla(x: any, y: any): any;
    obtener_posicion_escenario(x: any, y: any): any;
}
/**
 * @class Normal
 *
 * Escena básica de pilas.
 *
 * Si no se define ninguna escena, cuando se ejecuta:
 *
 *     @example
 *     pilas.iniciar();
 *
 * esta es la escena que se muestra en la pantalla.
 *
 */
declare class Normal extends Base {
    fondo: any;
    iniciar(): void;
}
declare class Evento {
    respuestas: any;
    nombre: any;
    constructor(nombre: any);
    emitir(evento: any): void;
    conectar(respuesta: any): void;
    desconectar(respuesta: any): void;
}
declare class ProxyEventos {
    click_de_mouse: any;
    cuando_termina_click: any;
    mueve_mouse: any;
    actualiza: any;
    pulsa_tecla: any;
    suelta_tecla: any;
    Evento: any;
    constructor();
}
declare var Box2D: any;
declare var PPM: number;
declare var box2d: {
    b2Vec2: any;
    b2AABB: any;
    b2BodyDef: any;
    b2Body: any;
    b2FixtureDef: any;
    b2Fixture: any;
    b2World: any;
    b2PolygonShape: any;
    b2DebugDraw: any;
    b2MouseJointDef: any;
};
declare function convertir_a_metros(valor: any): number;
declare function convertir_a_pixels(valor: any): number;
declare class Figura {
    cuerpo: any;
    camara: any;
    fisica: any;
    id: any;
    constructor(fisica: any);
    x: any;
    y: any;
    rotacion: number;
    obtener_posicion(): any;
    definir_posicion(x: any, y: any): void;
    obtener_rotacion(): number;
    definir_rotacion(angulo: any): void;
    empujar(dx: any, dy: any): void;
    eliminar(): void;
}
declare class Rectangulo extends Figura {
    constructor(fisica: any, x: any, y: any, ancho: any, alto: any, opciones: any);
}
declare class Circulo extends Figura {
    _radio: any;
    _escala: any;
    constructor(fisica: any, x: any, y: any, radio: any, opciones: any);
    definir_radio(): void;
    radio: any;
    escala: any;
}
declare class Fisica {
    mundo: any;
    Circulo: any;
    Rectangulo: any;
    camara: any;
    velocidad: any;
    timeStep: any;
    constructor(camara: any);
    actualizar(): void;
    definir_gravedad(dx: any, dy: any): void;
    dibujar_figuras_sobre_lienzo(graphics: any): void;
    convertir_vector_relativo_a_pantalla(cuerpo: any, x: any, y: any, v: any): {
        x: any;
        y: any;
    };
    createBox(width: any, height: any, pX: any, pY: any, type: any, data: any): any;
    crear_rectangulo(x: any, y: any, ancho: any, alto: any, opciones: any): any;
    crear_circulo(x: any, y: any, radio: any, opciones: any): any;
}
declare class ConstanteDeMovimiento {
    constante: any;
    cuerpo_enlazado: any;
    constructor(figura: any, evento: any);
    mover(x: any, y: any): void;
    eliminar(): void;
}
declare class Fondo extends Actor {
    constructor(imagen: any, x: any, y: any);
}
declare class Tarde extends Fondo {
    constructor();
}
declare class Plano extends Fondo {
    constructor();
    crear_sprite(): void;
    actualizar(): void;
}
declare class Pasto extends Fondo {
    constructor();
    crear_sprite(): void;
    actualizar(): void;
}
declare class PastoCuadriculado extends Fondo {
    constructor();
    actualizar(): void;
}
declare class Laberinto1 extends Fondo {
    constructor();
    actualizar(): void;
}
declare class Fondos {
    Plano: any;
    Pasto: any;
    PastoCuadriculado: any;
    Tarde: any;
    Laberinto1: any;
    constructor();
}
declare class GestorDeEscenas {
    escena: any;
    constructor();
    cambiar_escena(nueva_escena: any): void;
    actualizar(): void;
    escena_actual(): any;
}
declare class grupo {
    Grupo: any;
    constructor();
}
declare class HGrupo {
    constructor();
    pop(): any;
    push(val: any): number;
    length: number;
}
declare class Grupo extends HGrupo {
    constructor(actor_o_array: any);
    agregar_grupo(grupo: any): void;
    agregar_actor(actor: any): void;
    x: any[];
    y: any[];
    escala: any[];
    rotacion: any[];
    aprender(habilidad: any, argumentos?: any): void;
    hacer(comportamiento: any, argumentos?: any): void;
    hacer_luego(comportamiento: any, argumentos?: any): void;
    decir(mensaje: any): void;
    eliminar(): void;
    __getattr__(attr: any): any[];
    __setattr__(attr: any, valor: any): void;
    ejecutar_funcion(id: any, argumentos1?: any, argumentos2?: any): void;
}
/**
 * @class Habilidad
 *
 * Representa una habilidad que un actor puede aprender.
 */
declare class Habilidad {
    receptor: any;
    argumentos: any;
    constructor(receptor: any, argumentos?: any);
    actualizar(): void;
    eliminar(): void;
}
declare class Imitar extends Habilidad {
    objeto_a_imitar: any;
    con_rotacion: any;
    constructor(receptor: any, argumentos: any);
    actualizar(): void;
}
/**
 * @class PuedeExplotar
 *
 * Hace que un actor se pueda hacer explotar invocando al metodo eliminar.
 */
declare class PuedeExplotar extends Habilidad {
    constructor(receptor: any);
}
/**
 * @class SeguirAlMouse
 *
 * Hace que un actor siga la posición del mouse en todo momento.
 */
declare class SeguirAlMouse extends Habilidad {
    constructor(receptor: any);
    recibir(evento: any, tipo: any): void;
    mover(evento: any): void;
}
/**
 * @class SeguirClicks
 *
 * Hace que el actor se coloque la posición del cursor cuando se hace click.
 */
declare class SeguirClicks extends Habilidad {
    constructor(receptor: any);
    recibir(evento: any, tipo: any): void;
    moverse_a_este_punto(evento: any): void;
}
/**
 * @class MoverseConElTeclado
 *
 * Hace que un actor cambie de posición con pulsar el teclado.
 */
declare class MoverseConElTeclado extends Habilidad {
    en_movimiento: any;
    constructor(receptor: any);
    recibir(evento: any, tipo: any): void;
    mover(x: any, y: any): void;
}
declare class MoverseConElTecladoConRotacion extends Habilidad {
    constructor(receptor: any);
    recibir(evento: any, tipo: any): void;
}
/**
 * @class Arrastrable
 *
 * Hace que un objeto se pueda arrastrar con el puntero del mouse.
 *
 * Cuando comienza a mover al actor se llama al metodo
 * ''comienza_a_arrastrar'' y cuando termina llama a
 * ''termina_de_arrastrar''. Estos nombres de metodos se llaman para
 * que puedas personalizar estos eventos, dado que puedes usar
 * polimorfismo para redefinir el comportamiento de estos dos metodos.
 */
declare class Arrastrable extends Habilidad {
    debe_arrastrar: any;
    constante: any;
    constructor(receptor: any);
    recibir(evento: any, tipo: any): void;
    cuando_intenta_arrastrar(evento: any): void;
    cuando_arrastra(evento: any): void;
    cuando_termina_de_arrastrar(evento: any): void;
    comienza_a_arrastrar(evento: any): void;
    termina_de_arrastrar(): void;
}
declare class Disparar extends Habilidad {
    contador: any;
    constructor(receptor: any);
    recibir(evento: any, tipo: any): void;
}
declare class RebotarComoPelota extends Habilidad {
    constructor(receptor: any);
}
declare class RebotarComoCaja extends Habilidad {
    constructor(receptor: any);
}
declare class SeMantieneEnPantalla extends Habilidad {
    constructor(receptor: any);
    recibir(evento: any, tipo: any): void;
}
/**
 * @class Habilidades
 *
 * Representa todas las habilidades conocidas en pilas-engine.
 */
declare class Habilidades {
    Arrastrable: any;
    PuedeExplotar: any;
    SeguirAlMouse: any;
    SeguirClicks: any;
    MoverseConElTeclado: any;
    MoverseConElTecladoConRotacion: any;
    SeMantieneEnPantalla: any;
    Disparar: any;
    RebotarComoPelota: any;
    RebotarComoCaja: any;
    Imitar: any;
    constructor();
}
declare class Imagenes {
    nombresImagenes: string[];
    data_path: string;
    recursos: any;
    imagenes_solicitadas: any;
    loader: any;
    constructor(callback_onready: any, opciones: any);
    private cargar_recursos();
    private cargar_recurso(nombre);
    cargar(nombre: any): Imagen;
    cargar_grilla(nombre: any, columnas?: number, filas?: number): Grilla;
    cargar_animacion(nombre: any, columnas?: number, filas?: number): Animacion;
}
declare class Imagen {
    ruta: any;
    imagen: any;
    constructor(imagen: any);
    instanciar(): any;
    avanzar(velocidad?: number): boolean;
    ancho: any;
    alto: any;
}
declare class Grilla extends Imagen {
    columnas: any;
    filas: any;
    sprite: any;
    cuadro: any;
    constructor(imagen: any, columnas?: number, filas?: number);
    instanciar(): any;
    cantidad_cuadros: number;
    definir_cuadro(numero_de_cuadro: any): void;
    avanzar(velocidad?: number): boolean;
    ancho: number;
    alto: number;
}
declare class Animacion extends Grilla {
    animaciones: any;
    animacion_en_curso: any;
    cuadro_en_la_animacion: any;
    _ticks_acumulados: any;
    constructor(imagen: any, columnas?: number, filas?: number);
    definir_animacion(nombre: any, cuadros: any, velocidad: any): void;
    cargar_animacion(nombre: any): void;
    avanzar(velocidad?: number): boolean;
}
declare class Interpolaciones {
    interpolar(objeto: any, atributo: any, valor_o_valores: any, tiempo: any, tipo: any): void;
    AceleracionGradual(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
    DesaceleracionGradual(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
    ReboteInicial(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
    ReboteFinal(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
    ElasticoInicial(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
    ElasticoFinal(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
}
declare class Mundo {
    gestor_escenas: any;
    depurador: any;
    constructor();
    actualizar(): void;
    definir_modos(modos: any): void;
    obtener_modos(): any;
    agregar_tarea_una_vez(tiempo: any, funcion: any, parametros?: any, parent?: any): void;
    agregar_tarea_siempre(tiempo: any, funcion: any, parametros?: any, parent?: any): void;
}
declare var pilas: any;
declare var window: Window;
declare var pilasengine: any;
declare var PxLoader: any;
declare var createjs: any;
/**
 * @class Pilas
 * @singleton
 *
 * Módulo pilas
 * ============
 *
 * Pilas es una biblioteca para facilitar el desarrollo de videojuegos. Es útil para
 * programadores principiantes o para el desarrollo de juegos casuales.
 *
 * Este módulo contiene las funciones principales para iniciar y ejecutar la biblioteca.
 * {@img pilas-logo.png}
 *
 *     @example
 *     pilas.iniciar({ancho: 320, alto: 240});
 *     aceituna = new pilas.actores.Aceituna();
 */
declare class Pilas {
    canvas: any;
    opciones: any;
    mundo: any;
    fondos: any;
    imagenes: any;
    actores: any;
    habilidades: any;
    comportamientos: any;
    utils: any;
    grupo: any;
    tareas: any;
    rutinas: any;
    interpolaciones: any;
    colisiones: any;
    colores: any;
    sonidos: any;
    escena: any;
    eventos: any;
    ready: any;
    /**
     * @method iniciar
     *
     * Inicia la ventana principal del juego con algunos detalles de funcionamiento.
     *
     * Ejemplo de invocación:
     *
     *     @example
     *     pilas.iniciar({ancho: 320, alto: 240, data_path: 'data/'});
     *
     * Parámetros:
     *
     * - data_path: La ruta hacia la carpeta donde están las imágenes de los actores. (Por defecto 'data/')
     *
     */
    iniciar(opciones: any): void;
    observar_tareas(elemento_id: any, intervalo: any): void;
    reiniciar(): void;
    /**
     * @method escena_actual
     * Retorna la escena en curso.
     */
    escena_actual(): any;
    /**
     * @method inicializar_opciones
     * @private
     *
     * Carga las opciones iniciales y define los valores por omisión si es necesario.
     */
    private inicializar_opciones(opciones);
    /**
     * @method definir_tamano_del_canvas
     * @private
     *
     * Cambia el tamaño del canvas HTML en base a las opciones iniciales.
     */
    private definir_tamano_del_canvas();
    /**
     * @method obtener_codigo_y_texto_desde_evento
     * @private
     *
     * A partir del evento de teclado, obtiene su codigo y el texto de
     * la tecla presionada.
     */
    private obtener_codigo_y_texto_desde_evento(event);
    /**
     * @method conectar_eventos
     * @private
     *
     * Conecta los eventos del mouse y teclado a los métodos manejadores
     * de eventos de la escena actual.
     */
    private conectar_eventos();
    /**
     * @method obtener_posicion_desde_evento
     * @private
     *
     * A partir del evento del mouse, obtiene la posicion del puntero en
     * las coordenadas de Pilas.
     */
    private obtener_posicion_desde_evento(canvas, event);
    /**
     * @method obtener_canvas
     * @private
     *
     * Obtiene la referencia al elemento HTML canvas usando
     * el atributo *canvas_id* de las opciones iniciales.
     */
    private obtener_canvas();
    /**
     * @method onready
     * Callback que se invoca una vez que pilas puede comenzar a funcionar.
     */
    onready(): void;
    /**
     * @method ejecutar
     * Pone en funcionamiento el bucle principal.
     */
    ejecutar(): void;
    /**
     * @method actualizar
     * Se ejecuta automáticamente 60 veces por segundo, para mantener el juego en funcionamiento.
     */
    actualizar(): void;
    interpolar(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): any;
    definir_modos(modos: any): void;
    mostrar_posiciones(): string;
    ocultar_posiciones(): string;
    mostrar_fisica(): string;
    ocultar_fisica(): string;
    /**
     * @method obtener_actores_en
     * Se ejecuta para conseguir una lista de todos los actores que estén en una
     * coordenanda determinada de la pantalla.
     *
     * Opcionalmente se puede espeficiar una etiqueta a modo de filtro, con el
     * parámetro "con_etiqueta".
     *
     * ejemplos de invocaciones:
     *
     *     >>> pilas.obtener_actores_en(0, 0)
     *     [Actor, Mono, Fondo]
     *
     *     >>> pilas.obtener_actores_en(0, 0, 'Mono')
     *     [Mono]
     *
     */
    obtener_actores_en(x: any, y: any, con_etiqueta?: any): any[];
    obtener_actores_con_etiqueta(etiqueta: any): any[];
    izquierda(): number;
    derecha(): number;
    arriba(): number;
    abajo(): number;
}
declare class Rutinas {
    lista_de_rutinas: any;
    constructor();
    observar_tareas(elemento_id: any, intervalo: any): void;
    agregar(nombre: any, actor: any, init: any, update: any): void;
    actualizar(): void;
}
declare var simbolos: {
    IZQUIERDA: number;
    DERECHA: number;
    ARRIBA: number;
    ABAJO: number;
    ESPACIO: number;
    W: number;
    A: number;
    S: number;
    D: number;
    J: number;
};
declare class Sonidos {
    recursos: any;
    preload: any;
    constructor(data_path: any);
    private cargar_recursos();
    private cargar_recurso(nombre);
    cargar(nombre: any): Sonido;
}
declare class Sonido {
    nombre: any;
    constructor(nombre: any);
    reproducir(repetir?: boolean): any;
    detener(): any;
}
declare class tareas {
    Tareas: any;
    constructor();
}
declare class Tarea {
    tiempo: any;
    tiempo_aux: any;
    funcion: any;
    una_vez: any;
    parametros: any;
    parent: any;
    constructor(tiempo: any, funcion: any, una_vez: any, parametros: any, parent: any);
    ejecutar(): void;
}
declare class Tareas {
    tareas_planificadas: any;
    contador_de_tiempo: any;
    constructor();
    _agregar_tarea(tarea: any): void;
    siempre(tiempo: any, funcion: any, parametros: any, parent: any): void;
    una_vez(tiempo: any, funcion: any, parametros: any, parent: any): void;
    actualizar(): void;
}
declare var Math: Math;
declare class Utils {
    convertir_a_grados(angulo_en_radianes: any): number;
    convertir_a_radianes(angulo_en_grados: any): number;
    colisionan(a: any, b: any): boolean;
    distancia_entre_dos_actores(a: any, b: any): number;
    distancia_entre_dos_puntos(x1: any, y1: any, x2: any, y2: any): number;
    obtener_uuid(): any;
    distancia(a: any, b: any): number;
    fabricar(clase: any, cantidad?: number, posiciones_al_azar?: boolean): any;
}
