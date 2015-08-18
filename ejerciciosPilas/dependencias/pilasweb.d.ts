declare class Estudiante {
    public habilidades: any;
    public comportamientos: any;
    public comportamiento_actual: any;
    constructor();
    public aprender(clase_de_habilidad: any, argumentos?: any): string;
    public agregar_habilidad(clase_de_habilidad: any, argumentos: any): void;
    public actualizar_habilidades(): void;
    public hacer(comportamiento: any, argumentos?: {}): void;
    public hacer_luego(comportamiento: any, argumentos?: {}): void;
    public actualizar_comportamientos(): void;
    public _adoptar_el_siguiente_comportamiento(): void;
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
    public sprite: any;
    public _imagen: any;
    public vivo: any;
    public radio_de_colision: any;
    public id: any;
    public figura: any;
    public _espejado: any;
    public callbacks_cuando_hace_click: any;
    public callbacks_cuando_mueve_mouse: any;
    public etiquetas: any;
    public evto_se_movio: any;
    constructor(imagen: any, x: any, y: any, atributos?: {});
    public getClassName(): string;
    public iniciar(): void;
    public tiene_fisica(): boolean;
    private _crear_sprite();
    public eliminar(): void;
    public z : any;
    public espejado : any;
    public x : any;
    public y : any;
    public centro : any[];
    public centro_x : any;
    public centro_y : any;
    public escala_x : any;
    public escala_y : any;
    public escala : any;
    public escalarProporcionalALimites(anchoLimite: any, altoLimite: any): void;
    public escalarAAncho(anchoDeseado: any): void;
    public escalarAAlto(altoDeseado: any): void;
    public rotacion : any;
    public transparencia : number;
    public ancho : number;
    public alto : number;
    public imagen : any;
    public izquierda : number;
    public derecha : number;
    public arriba : any;
    public abajo : number;
    public ejecutar_callbacks_clicks(): void;
    public ejecutar_callbacks_over(): void;
    public cuando_hace_click : any;
    public cuando_mueve_mouse : any;
    public recibir(evento: any, tipo: any): void;
    public _cuando_hace_click(click: any): void;
    public _cuando_mueve_mouse(evento: any): void;
    /**
    * @method colisiona_con_un_punto
    *
    * Determina si un punto colisiona con el area del actor.
    */
    public colisiona_con_un_punto(x: any, y: any): boolean;
    public decir(mensaje: any): void;
    public imitar(actor_o_figura: any): void;
    public pre_actualizar(): void;
    public actualizar(): void;
    public colisiona_con(otro_actor: any): any;
    public esta_fuera_de_la_pantalla(): boolean;
    public tiene_etiqueta(etiqueta: any): boolean;
}
declare var Math: Math;
declare class Utils {
    public convertir_a_grados(angulo_en_radianes: any): number;
    public convertir_a_radianes(angulo_en_grados: any): number;
    public colisionan(a: any, b: any): boolean;
    public distancia_entre_dos_actores(a: any, b: any): number;
    public distancia_entre_dos_puntos(x1: any, y1: any, x2: any, y2: any): number;
    public obtener_uuid(): any;
    public distancia(a: any, b: any): number;
    public fabricar(clase: any, cantidad?: number, posiciones_al_azar?: boolean): any;
}
declare class grupo {
    public Grupo: any;
    constructor();
}
declare class HGrupo {
    constructor();
    public pop(): any;
    public push(val: any): number;
    public length: number;
}
declare class Grupo extends HGrupo {
    constructor(actor_o_array: any);
    public agregar_grupo(grupo: any): void;
    public agregar_actor(actor: any): void;
    public x : any[];
    public y : any[];
    public escala : any[];
    public rotacion : any[];
    public aprender(habilidad: any, argumentos?: any): void;
    public hacer(comportamiento: any, argumentos?: any): void;
    public hacer_luego(comportamiento: any, argumentos?: any): void;
    public decir(mensaje: any): void;
    public eliminar(): void;
    public __getattr__(attr: any): any[];
    public __setattr__(attr: any, valor: any): void;
    public ejecutar_funcion(id: any, argumentos1?: any, argumentos2?: any): void;
}
declare class Fondo extends Actor {
    constructor(imagen: any, x: any, y: any);
}
declare class Tarde extends Fondo {
    constructor();
}
declare class Plano extends Fondo {
    constructor();
    public crear_sprite(): void;
    public actualizar(): void;
}
declare class Pasto extends Fondo {
    constructor();
    public crear_sprite(): void;
    public actualizar(): void;
}
declare class PastoCuadriculado extends Fondo {
    constructor();
    public actualizar(): void;
}
declare class Laberinto1 extends Fondo {
    constructor();
    public actualizar(): void;
}
declare class Fondos {
    public Plano: any;
    public Pasto: any;
    public PastoCuadriculado: any;
    public Tarde: any;
    public Laberinto1: any;
    constructor();
}
declare class Imagenes {
    public nombresImagenes: string[];
    public data_path: string;
    public recursos: any;
    public imagenes_solicitadas: any;
    public loader: any;
    constructor(callback_onready: any, opciones: any);
    private cargar_recursos();
    private cargar_recurso(nombre);
    public cargar(nombre: any): Imagen;
    public cargar_grilla(nombre: any, columnas?: number, filas?: number): Grilla;
    public cargar_animacion(nombre: any, columnas?: number, filas?: number): Animacion;
}
declare class Imagen {
    public ruta: any;
    public imagen: any;
    constructor(imagen: any);
    public instanciar(): any;
    public avanzar(velocidad?: number): boolean;
    public ancho : any;
    public alto : any;
}
declare class Grilla extends Imagen {
    public columnas: any;
    public filas: any;
    public sprite: any;
    public cuadro: any;
    constructor(imagen: any, columnas?: number, filas?: number);
    public instanciar(): any;
    public cantidad_cuadros : number;
    public definir_cuadro(numero_de_cuadro: any): void;
    public avanzar(velocidad?: number): boolean;
    public ancho : number;
    public alto : number;
}
declare class Animacion extends Grilla {
    public animaciones: any;
    public animacion_en_curso: any;
    public cuadro_en_la_animacion: any;
    public _ticks_acumulados: any;
    constructor(imagen: any, columnas?: number, filas?: number);
    public definir_animacion(nombre: any, cuadros: any, velocidad: any): void;
    public cargar_animacion(nombre: any): void;
    public avanzar(velocidad?: number): boolean;
}
declare class GestorDeEscenas {
    public escena: any;
    constructor();
    public cambiar_escena(nueva_escena: any): void;
    public actualizar(): void;
    public escena_actual(): any;
}
declare class DepuradorDeshabilitado {
    public modos: any;
    public diccionario_modos: any;
    constructor();
    public actualizar(): void;
    public definir_modos(modos: any): void;
    public eliminar_todos_los_modos(): void;
    public obtener_modos(): any;
}
declare class ModoDeDepuracion {
    public shape: any;
    public container: any;
    public grosor_linea: any;
    constructor();
    public eliminar(): void;
    public actualizar(): void;
}
declare class ModoRadiosDeColision extends ModoDeDepuracion {
    public actualizar(): void;
}
declare class ModoArea extends ModoDeDepuracion {
    public actualizar(): void;
}
declare class ModoPuntosDeControl extends ModoDeDepuracion {
    public actualizar(): void;
}
declare class ModoFisica extends ModoDeDepuracion {
    public actualizar(): void;
}
declare class ModoPosicion extends ModoDeDepuracion {
    public text_coordenada: any;
    public eje: any;
    constructor();
    private sobre_escribir_dibujado();
    public eliminar(): void;
    public actualizar(): void;
}
declare class Mundo {
    public gestor_escenas: any;
    public depurador: any;
    constructor();
    public actualizar(): void;
    public definir_modos(modos: any): void;
    public obtener_modos(): any;
    public agregar_tarea_una_vez(tiempo: any, funcion: any, parametros?: any, parent?: any): void;
    public agregar_tarea_siempre(tiempo: any, funcion: any, parametros?: any, parent?: any): void;
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
    public izquierda: any;
    public derecha: any;
    public arriba: any;
    public abajo: any;
    public boton: any;
    constructor(escena: any);
    public recibir(evento: any, tipo: any): void;
    public cuando_pulsa_una_tecla(evento: any): void;
    public cuando_suelta_una_tecla(evento: any): void;
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
    public escenario: any;
    public centro_x: any;
    public centro_y: any;
    constructor(escenario: any);
    public x : any;
    public y : any;
    public zoom : any;
    /**
    * @method obtener_posicion_pantalla
    *
    * Convierte una posición del escenario de pilas al formato
    * de coordenadas del navegador.
    *
    * Por ejemplo, el punto (0, 0) es el centro del escenario para
    * pilas, pero el navegador lo interpreta como el punto (160, 120).
    */
    public obtener_posicion_pantalla(x: any, y: any): {
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
    public obtener_posicion_escenario(x: any, y: any): {
        x: number;
        y: number;
    };
    public obtener_posicion(): {
        x: number;
        y: any;
    };
    public convertir_de_posicion_relativa_a_fisica(x: any, y: any): {
        x: any;
        y: number;
    };
    public convertir_de_posicion_fisica_a_relativa(x: any, y: any): {
        x: any;
        y: number;
    };
    public obtener_area_visible(): {
        izquierda: number;
        derecha: any;
        arriba: any;
        abajo: number;
    };
}
declare class Evento {
    public respuestas: any;
    public nombre: any;
    constructor(nombre: any);
    public emitir(evento: any): void;
    public conectar(respuesta: any): void;
    public desconectar(respuesta: any): void;
}
declare class ProxyEventos {
    public click_de_mouse: any;
    public cuando_termina_click: any;
    public mueve_mouse: any;
    public actualiza: any;
    public pulsa_tecla: any;
    public suelta_tecla: any;
    public Evento: any;
    constructor();
}
declare class escena {
    public Base: any;
    public Normal: any;
    constructor();
}
declare class Base {
    public click_de_mouse: any;
    public cuando_termina_click: any;
    public mueve_mouse: any;
    public actualiza: any;
    public pulsa_tecla: any;
    public suelta_tecla: any;
    public fisica: any;
    public stage: any;
    public camara: any;
    public control: any;
    public actores: any;
    public tareas: any;
    constructor();
    public iniciar(): void;
    public actualizar(): void;
    public necesita_ordenar_actores(): boolean;
    public ordenar_actores_por_valor_z(): void;
    public agregar_actor(actor: any): void;
    public eliminar_actor(actor: any): void;
    public obtener_posicion_pantalla(x: any, y: any): any;
    public obtener_posicion_escenario(x: any, y: any): any;
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
    public fondo: any;
    public iniciar(): void;
}
declare class Interpolaciones {
    public interpolar(objeto: any, atributo: any, valor_o_valores: any, tiempo: any, tipo: any): void;
    public AceleracionGradual(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
    public DesaceleracionGradual(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
    public ReboteInicial(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
    public ReboteFinal(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
    public ElasticoInicial(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
    public ElasticoFinal(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): void;
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
    public cuerpo: any;
    public camara: any;
    public fisica: any;
    public id: any;
    constructor(fisica: any);
    public x : any;
    public y : any;
    public rotacion : number;
    public obtener_posicion(): any;
    public definir_posicion(x: any, y: any): void;
    public obtener_rotacion(): number;
    public definir_rotacion(angulo: any): void;
    public empujar(dx: any, dy: any): void;
    public eliminar(): void;
}
declare class Rectangulo extends Figura {
    constructor(fisica: any, x: any, y: any, ancho: any, alto: any, opciones: any);
}
declare class Circulo extends Figura {
    public _radio: any;
    public _escala: any;
    constructor(fisica: any, x: any, y: any, radio: any, opciones: any);
    public definir_radio(): void;
    public radio : any;
    public escala : any;
}
declare class Fisica {
    public mundo: any;
    public Circulo: any;
    public Rectangulo: any;
    public camara: any;
    public velocidad: any;
    public timeStep: any;
    constructor(camara: any);
    public actualizar(): void;
    public definir_gravedad(dx: any, dy: any): void;
    public dibujar_figuras_sobre_lienzo(graphics: any): void;
    public convertir_vector_relativo_a_pantalla(cuerpo: any, x: any, y: any, v: any): {
        x: any;
        y: any;
    };
    public createBox(width: any, height: any, pX: any, pY: any, type: any, data: any): any;
    public crear_rectangulo(x: any, y: any, ancho: any, alto: any, opciones: any): any;
    public crear_circulo(x: any, y: any, radio: any, opciones: any): any;
}
declare class ConstanteDeMovimiento {
    public constante: any;
    public cuerpo_enlazado: any;
    constructor(figura: any, evento: any);
    public mover(x: any, y: any): void;
    public eliminar(): void;
}
/**
* @class Habilidad
*
* Representa una habilidad que un actor puede aprender.
*/
declare class Habilidad {
    public receptor: any;
    public argumentos: any;
    constructor(receptor: any, argumentos?: any);
    public actualizar(): void;
    public eliminar(): void;
}
declare class Imitar extends Habilidad {
    public objeto_a_imitar: any;
    public con_rotacion: any;
    constructor(receptor: any, argumentos: any);
    public actualizar(): void;
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
    public recibir(evento: any, tipo: any): void;
    public mover(evento: any): void;
}
/**
* @class SeguirClicks
*
* Hace que el actor se coloque la posición del cursor cuando se hace click.
*/
declare class SeguirClicks extends Habilidad {
    constructor(receptor: any);
    public recibir(evento: any, tipo: any): void;
    public moverse_a_este_punto(evento: any): void;
}
/**
* @class MoverseConElTeclado
*
* Hace que un actor cambie de posición con pulsar el teclado.
*/
declare class MoverseConElTeclado extends Habilidad {
    public en_movimiento: any;
    constructor(receptor: any);
    public recibir(evento: any, tipo: any): void;
    public mover(x: any, y: any): void;
}
declare class MoverseConElTecladoConRotacion extends Habilidad {
    constructor(receptor: any);
    public recibir(evento: any, tipo: any): void;
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
    public debe_arrastrar: any;
    public constante: any;
    constructor(receptor: any);
    public recibir(evento: any, tipo: any): void;
    public cuando_intenta_arrastrar(evento: any): void;
    public cuando_arrastra(evento: any): void;
    public cuando_termina_de_arrastrar(evento: any): void;
    public comienza_a_arrastrar(evento: any): void;
    public termina_de_arrastrar(): void;
}
declare class Disparar extends Habilidad {
    public contador: any;
    constructor(receptor: any);
    public recibir(evento: any, tipo: any): void;
}
declare class RebotarComoPelota extends Habilidad {
    constructor(receptor: any);
}
declare class RebotarComoCaja extends Habilidad {
    constructor(receptor: any);
}
declare class SeMantieneEnPantalla extends Habilidad {
    constructor(receptor: any);
    public recibir(evento: any, tipo: any): void;
}
/**
* @class Habilidades
*
* Representa todas las habilidades conocidas en pilas-engine.
*/
declare class Habilidades {
    public Arrastrable: any;
    public PuedeExplotar: any;
    public SeguirAlMouse: any;
    public SeguirClicks: any;
    public MoverseConElTeclado: any;
    public MoverseConElTecladoConRotacion: any;
    public SeMantieneEnPantalla: any;
    public Disparar: any;
    public RebotarComoPelota: any;
    public RebotarComoCaja: any;
    public Imitar: any;
    constructor();
}
/**
* @class Comportamiento
*
* Representa una habilidad que un actor puede aprender.
*/
declare class Comportamiento {
    public receptor: any;
    public argumentos: any;
    constructor(argumentos: any);
    public iniciar(receptor: any): void;
    public actualizar(): void;
    public eliminar(): void;
}
declare class AvanzarComoProyectil extends Comportamiento {
    public velocidad: any;
    public dx: any;
    public dy: any;
    public iniciar(receptor: any): void;
    public actualizar(): void;
}
declare class Avanzar extends Comportamiento {
    public pasos: any;
    public velocidad: any;
    public dx: any;
    public dy: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
declare class Girar extends Comportamiento {
    public angulo: any;
    public tiempo: any;
    public angulo_aux: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
declare class Saltar extends Comportamiento {
    public cuando_termina: any;
    public suelo: any;
    public velocidad_inicial: any;
    public velocidad: any;
    public velocidad_aux: any;
    public sonido_saltar: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
declare class Saltando extends Comportamiento {
    public suelo: any;
    public dy: any;
    public cuando_termina: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
declare class Orbitar extends Comportamiento {
    public punto_de_orbita_x: any;
    public punto_de_orbita_y: any;
    public radio: any;
    public velocidad: any;
    public direccion: any;
    public angulo: any;
    public iniciar(receptor: any): void;
    public actualizar(): void;
    public mover_astro(): void;
}
declare class OrbitarSobreActor extends Orbitar {
    public actor: any;
    public iniciar(receptor: any): void;
    public actualizar(): void;
}
declare class CaminarBase extends Comportamiento {
    public pasos: any;
    public velocidad: any;
    public cantActualizaciones: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
    public mover(): void;
}
declare class CaminaArriba extends CaminarBase {
    public mover(): void;
}
declare class CaminaAbajo extends CaminarBase {
    public mover(): void;
}
declare class CaminaIzquierda extends CaminarBase {
    public mover(): void;
}
declare class CaminaDerecha extends CaminarBase {
    public mover(): void;
}
/**
* @class Secuencia
*
* Representa una secuencia de comportamientos que un actor realiza de forma ordenada.
*
* Espera una lista de comportamientos.
*/
declare class Secuencia extends Comportamiento {
    public secuencia: any;
    public comando_actual: any;
    public reiniciar: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
/**
* @class Alternativa
*
* Representa un if-then-else entre dos comportamientos. Se ejecuta uno u otro dependiendo de una condicion.
*
* Recibe como argumentos dos comportamientos de tipo Secuencia y una funcion booleana a evaluar.
*/
declare class Alternativa extends Comportamiento {
    public rama_entonces: any;
    public rama_sino: any;
    public condicion: any;
    public rama_elegida: any;
    public ejecutado: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
/**
* @class RepetirHasta
*
* Representa un bucle condicional que repite un comportamiento hasta que se cumple cierta condicion.
*
* Recibe como argumento un comportamiento de tipo Secuencia y una funcion booleana a evaluar.
*/
declare class RepetirHasta extends Comportamiento {
    public ejecutado: any;
    public secuencia: any;
    public condicion: any;
    public evaluar_condicion: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
/**
* @class RepetirN
*
* Representa un bucle que repite una cierta cantidad de veces un comportamiento
*
* Recibe como argumento un comportamiento de tipo Secuencia y una funcion booleana a evaluar.
*/
declare class RepetirN extends Comportamiento {
    public secuencia: any;
    public cantidad: any;
    public cantidad_actual: any;
    public volver_a_evaluar: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
/**
* @class CambiarAtributo
*
* Representa el cambio de un atributo del actor
*
* Recibe como argumento una funcion cuyo resultado sera guardado como valor del atributo
*/
declare class CambiarAtributo extends Comportamiento {
    public nombre: any;
    public funcion_valor: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
/**
* @class CambiarVariableLocal
*
* Representa el cambio de una variable local del procedimiento actual
*
* Recibe como argumento una funcion cuyo resultado sera guardado como valor del atributo
*/
declare class CambiarVariableLocal extends Comportamiento {
    public nombre: any;
    public funcion_valor: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
/**
* @class LlamadaProcedimiento
*
* Representa una llamada a un procedimiento
*
* Recibe como argumentos el nombre del procedimiento y el contexto de
* definiciones
*/
declare class LlamadaProcedimiento extends Comportamiento {
    public nombre: any;
    public procedimientos: any;
    public secuencia: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
/**
* @class Expresion
*
* Representa la evaluacion de una expresion
*
* Recibe como argumento la expresión a evaluar
*/
declare class Expresion extends Comportamiento {
    public expresion: any;
    public resultado: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
/**
* @class LlamadaFuncion
*
* Representa una llamada a una funcion
*
* Recibe como argumentos el nombre de la funcion, el contexto de
* definiciones de funciones y la expresión a retornar
*/
declare class LlamadaFuncion extends Expresion {
    public nombre: any;
    public funciones: any;
    public secuencia: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
/**
* @class ConstructorDePrograma
*
* Permite construir un comportamiento que representa un programa
*
**/
declare class ConstructorDePrograma {
    public stack_secuencias: any;
    public procedimientos: any;
    public funciones: any;
    constructor();
    public empezar_secuencia(): void;
    public hacer(comportamiento: any, argumentos: any): void;
    public terminar_secuencia(): void;
    public repetir_hasta(c: any): void;
    public alternativa_si(c: any): void;
    public alternativa_sino(c: any): void;
    public repetirN(n: any): void;
    public def_proc(n: any, params: any): void;
    public llamada_proc(n: any, proc_args: any): void;
    public def_func(n: any): void;
    public llamada_func(n: any, exp: any): void;
    public cambio_atributo(n: any, f: any): void;
    public cambio_variable(n: any, f: any): void;
    public inyectar_scopes(actor: any): void;
    public inyectar_parametros(actor: any): void;
    public inyectar_variables_locales(actor: any): void;
    public inyectar_atributos(actor: any): void;
    public ejecutar(actor: any): void;
}
declare class Programa extends Comportamiento {
    public programa: any;
    public iniciar(receptor: any): void;
    public actualizar(): boolean;
}
/**
* @class Comportamientos
*
* Representa todos los comportamientos que puede hacer un actor en pilas-engine.
*/
declare class Comportamientos {
    public Subir: any;
    public CaminarBase: any;
    public CaminaArriba: any;
    public CaminaAbajo: any;
    public CaminaIzquierda: any;
    public CaminaDerecha: any;
    public Orbitar: any;
    public OrbitarSobreActor: any;
    public Saltar: any;
    public Girar: any;
    public Avanzar: any;
    public AvanzarComoProyectil: any;
    public Saltando: any;
    public Secuencia: any;
    public Alternativa: any;
    public RepetirHasta: any;
    public RepetirN: any;
    public ConstructorDePrograma: any;
    public Programa: any;
    constructor();
}
declare class Colisiones {
    public colisiones: any;
    constructor();
    public agregar(grupo_a: any, grupo_b: any, funcion_a_llamar: any, parent?: any): void;
    public verificar_colisiones(): void;
    public _verificar_colisiones_en_tupla(tupla: any): void;
}
declare class colores {
    public negro: any;
    public blanco: any;
    public rojo: any;
    public verde: any;
    public azul: any;
    public gris: any;
    public amarillo: any;
    public magenta: any;
    public cyan: any;
    public grisclaro: any;
    public grisoscuro: any;
    public verdeoscuro: any;
    public azuloscuro: any;
    public naranja: any;
    public rosa: any;
    public violeta: any;
    public marron: any;
    public negro_transparente: any;
    public blanco_transparente: any;
    public rojo_transparente: any;
    public verde_transparente: any;
    public azul_transparente: any;
    public gris_transparente: any;
    constructor();
}
declare class tareas {
    public Tareas: any;
    constructor();
}
declare class Tarea {
    public tiempo: any;
    public tiempo_aux: any;
    public funcion: any;
    public una_vez: any;
    public parametros: any;
    public parent: any;
    constructor(tiempo: any, funcion: any, una_vez: any, parametros: any, parent: any);
    public ejecutar(): void;
}
declare class Tareas {
    public tareas_planificadas: any;
    public contador_de_tiempo: any;
    constructor();
    public _agregar_tarea(tarea: any): void;
    public siempre(tiempo: any, funcion: any, parametros: any, parent: any): void;
    public una_vez(tiempo: any, funcion: any, parametros: any, parent: any): void;
    public actualizar(): void;
}
declare class Sonidos {
    public recursos: any;
    public preload: any;
    constructor(data_path: any);
    private cargar_recursos();
    private cargar_recurso(nombre);
    public cargar(nombre: any): Sonido;
}
declare class Sonido {
    public nombre: any;
    constructor(nombre: any);
    public reproducir(repetir?: boolean): any;
    public detener(): any;
}
declare class Rutinas {
    public lista_de_rutinas: any;
    constructor();
    public observar_tareas(elemento_id: any, intervalo: any): void;
    public agregar(nombre: any, actor: any, init: any, update: any): void;
    public actualizar(): void;
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
    public canvas: any;
    public opciones: any;
    public mundo: any;
    public fondos: any;
    public imagenes: any;
    public actores: any;
    public habilidades: any;
    public comportamientos: any;
    public utils: any;
    public grupo: any;
    public tareas: any;
    public rutinas: any;
    public interpolaciones: any;
    public colisiones: any;
    public colores: any;
    public sonidos: any;
    public escena: any;
    public eventos: any;
    public ready: any;
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
    public iniciar(opciones: any): void;
    public observar_tareas(elemento_id: any, intervalo: any): void;
    public reiniciar(): void;
    /**
    * @method escena_actual
    * Retorna la escena en curso.
    */
    public escena_actual(): any;
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
    public onready(): void;
    /**
    * @method ejecutar
    * Pone en funcionamiento el bucle principal.
    */
    public ejecutar(): void;
    /**
    * @method actualizar
    * Se ejecuta automáticamente 60 veces por segundo, para mantener el juego en funcionamiento.
    */
    public actualizar(): void;
    public interpolar(objeto: any, atributo: any, valor_o_valores: any, tiempo: any): any;
    public definir_modos(modos: any): void;
    public mostrar_posiciones(): string;
    public ocultar_posiciones(): string;
    public mostrar_fisica(): string;
    public ocultar_fisica(): string;
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
    public obtener_actores_en(x: any, y: any, con_etiqueta?: any): any[];
    public obtener_actores_con_etiqueta(etiqueta: any): any[];
    public izquierda(): number;
    public derecha(): number;
    public arriba(): number;
    public abajo(): number;
}
declare class Aceituna extends Actor {
    public cuadro_normal: any;
    public cuadro_reir: any;
    public cuadro_burlar: any;
    public cuadro_gritar: any;
    constructor(x: any, y: any);
    public normal(): void;
    public reir(): void;
    public gritar(): void;
    public burlarse(): void;
    public saltar(): void;
}
declare class Bomba extends Actor {
    public paso: any;
    constructor(x: any, y: any);
    public actualizar(): void;
}
declare class Nave extends Actor {
    public paso: any;
    public teclado_habilitado: any;
    public enemigos: any;
    constructor(x: any, y: any);
    public habilitar_teclado(): string;
    public actualizar(): void;
    public disparar(): string;
    public avanzar(velocidad: any): void;
    public definir_enemigos(enemigos: any): string;
}
declare class Explosion extends Actor {
    public paso: any;
    constructor(x: any, y: any);
    public actualizar(): void;
}
declare class Proyectil extends Actor {
    public paso: any;
    public enemigos: any;
    constructor(x: any, y: any, atributos: any);
    public actualizar(): void;
    public analizar_colisiones(): void;
}
declare class Piedra extends Actor {
    public dx: any;
    public dy: any;
    constructor(x: any, y: any, tamano: any, dx: any, dy: any);
    public actualizar(): void;
    public empujar(dx: any, dy: any): string;
    public clonar(veces: any): string;
    public obtener_tamano_al_azar(): string;
}
declare class Eje extends Actor {
    constructor(x: any, y: any);
}
declare class Maton extends Actor {
    public paso: any;
    public cuadros: any;
    public direccion: any;
    public velocidad: any;
    public animar: any;
    public obstaculos: any;
    public teclado_habilitado: any;
    constructor(x: any, y: any);
    public actualizar(): void;
    public iniciar_animacion(): void;
    public detener_animacion(): void;
    public avanzar_animacion(): void;
    public mover(x: any, y: any): void;
    public puede_moverse_a(x: any, y: any): boolean;
    public caminar_arriba(pasos: any): string;
    public caminar_abajo(pasos: any): string;
    public caminar_izquierda(pasos: any): string;
    public caminar_derecha(pasos: any): string;
    public saludar(): string;
    public habilitar_teclado(): string;
    public inspeccionar(): string;
}
declare class Globo extends Actor {
    public mensaje: any;
    public actor_texto: any;
    public actor: any;
    public puntita: any;
    public margen: any;
    constructor(actor: any, mensaje: any);
    public duracion(): number;
    public eliminar(): void;
    public crearTexto(): void;
    public actualizarMedidas(): void;
    public ubicar(): void;
    public ubicarEnY(): void;
    public ubicarEnX(): void;
    public ubicarADerechaDelActor(): void;
    public ubicarAIzquierdaDelActor(): void;
}
declare class Texto extends Actor {
    public spriteCJS: any;
    public elString: any;
    public color: any;
    constructor(x: any, y: any, elString: any, color?: string);
    public crear_texto(): void;
    public eliminar_texto(): void;
    public eliminar(): void;
    public actualizarMedidas(): void;
    public anchoMaximo(ancho: any): void;
    public reubicar(centro_x: any, centro_y: any): void;
    public cantidadDeLineas(): number;
}
declare class Bloque extends Actor {
    constructor(x: any, y: any, nombre_imagen: any);
}
declare class Manzana extends Actor {
    constructor(x: any, y: any);
}
declare class Cofre extends Actor {
    public paso: any;
    public esta_abierto: any;
    constructor(x: any, y: any);
    public abrir(): void;
    public actualizar(): void;
}
declare class Llave extends Actor {
    constructor(x: any, y: any);
}
declare class Caja extends Actor {
    constructor(x: any, y: any);
}
declare class Cesto extends Actor {
    public figura1: any;
    public figura2: any;
    public figura3: any;
    constructor(x?: number, y?: number);
}
declare class Pelota extends Actor {
    public figura: any;
    constructor(x: any, y: any);
    public empujar(dx: any, dy: any): string;
    public posicion(x: any, y: any): void;
}
declare class Zanahoria extends Actor {
    public cuadro_normal: any;
    public cuadro_sonrie: any;
    constructor(x: any, y: any);
    public normal(): void;
    public sonreir(): void;
    public saltar(): void;
    public decir(): void;
}
declare class Boton extends Actor {
    public ruta_normal: any;
    public ruta_press: any;
    public ruta_over: any;
    public funciones_normal: any;
    public funciones_press: any;
    public funciones_over: any;
    public estado: any;
    constructor(x: any, y: any, ruta_normal?: string, ruta_press?: string, ruta_over?: string);
    public recibir(evento: any, tipo: any): void;
    public conectar_normal(funcion: any, args?: any): void;
    public conectar_presionado(funcion: any, args?: any): void;
    public conectar_sobre(funcion: any, args?: any): void;
    public desconectar_normal_todo(): void;
    public desconectar_presionado_todo(): void;
    public desconectar_sobre_todo(): void;
    public desconectar_normal(funcion: any, args: any): void;
    public desconectar_presionado(funcion: any, args: any): void;
    public desconectar_sobre(funcion: any, args: any): void;
    public ejecutar_funciones_normal(): void;
    public ejecutar_funciones_press(): void;
    public ejecutar_funciones_over(): void;
    public activar(): void;
    public desactivar(): void;
    public pintar_normal(): void;
    public pintar_presionado(): void;
    public pintar_sobre(): void;
    public detectar_clic(click: any): void;
    public detectar_movimiento(evento: any): void;
}
declare class Puntaje extends Texto {
    public valor: any;
    constructor(x: any, y: any, puntaje: any, color: any);
    public aumentar(aumento: any): void;
    public obtener(): any;
}
declare class Mono extends Actor {
    public image_normal: any;
    public image_smile: any;
    public image_shout: any;
    public sound_smile: any;
    public sound_shout: any;
    constructor(x: any, y: any);
    public sonreir(): void;
    public gritar(): void;
    public normal(): void;
    public decir(mensaje: any): void;
    public saltar(): void;
}
declare class Banana extends Actor {
    constructor(x?: number, y?: number);
    public cerrar(): void;
    public abrir(): void;
}
declare class Tortuga extends Actor {
    public anterior_x: any;
    public anterior_y: any;
    public pizarra: any;
    public lapiz_bajo: any;
    public _color: any;
    constructor(x?: number, y?: number, dibuja?: boolean);
    public avanzar(pasos: any): void;
    public girarderecha(delta: any): void;
    public girarizquierda(delta: any): void;
    public actualizar(): void;
    public bajalapiz(): void;
    public subelapiz(): void;
    public crear_poligono(lados?: number, escala?: number, sentido?: number): void;
    public crear_circulo(radio: any, sentido?: number): void;
    public color : any;
}
declare class Pizarra extends Actor {
    public container: any;
    public lienzo: any;
    public _ancho: any;
    public _alto: any;
    constructor(x?: number, y?: number);
    public dibujar_punto(x: any, y: any, color?: any): void;
    public linea(x: any, y: any, x2: any, y2: any, color?: any, grosor?: number): void;
    public rectangulo(x: any, y: any, ancho: any, alto: any, color?: any, relleno?: any, grosor?: number): void;
    public poligono(puntos: any, color?: any, grosor?: number): void;
    public limpiar(): void;
    public pintar(color: any): void;
}
declare class Pingu extends Actor {
    public paso: any;
    public cuadros_correr: any;
    public saltando: any;
    constructor(x?: number, y?: number);
    public actualizar(): void;
    public puede_saltar(): void;
    public mover(x: any, y: any): void;
    public animacion_correr(): void;
    public detener_animacion(): void;
}
declare class Alien extends Actor {
    public sombra: any;
    public limitar_movimientos: any;
    public sonido_blabla: any;
    public cuando_busca_recoger: any;
    constructor(x?: number, y?: number);
    public iniciar(): void;
    public decir(mensaje: any): void;
    public super_decir(mensaje: any): void;
    public actualizar(): void;
    public avanzar_animacion(): any;
    public ir_derecha(): void;
    public ir_izquierda(): void;
    public ir_arriba(): void;
    public ir_abajo(): void;
    public esperar(tiempo?: number): void;
    public detener(): void;
    public recoger(): void;
    public colisiona_con_item(item_name: any): any;
}
declare class Movimiento {
    public receptor: any;
    public argumentos: any;
    public tiempo: any;
    public cantidad: any;
    public _contador_de_tiempo: any;
    public _velocidad: any;
    constructor(argumentos: any);
    public iniciar(receptor: any): void;
    public iniciar_animacion(): void;
    public supero_el_tiempo(): boolean;
    public al_terminar(): void;
}
declare class MoverHaciaDerecha extends Movimiento {
    public iniciar_animacion(): void;
    public actualizar(): boolean;
    public realizar_movimiento(): void;
}
declare class MoverHaciaIzquierda extends MoverHaciaDerecha {
    public iniciar_animacion(): void;
    public realizar_movimiento(): void;
}
declare class MoverHaciaArriba extends MoverHaciaDerecha {
    public iniciar_animacion(): void;
    public realizar_movimiento(): void;
}
declare class MoverHaciaAbajo extends MoverHaciaDerecha {
    public iniciar_animacion(): void;
    public realizar_movimiento(): void;
}
declare class Esperar extends MoverHaciaDerecha {
    public iniciar_animacion(): void;
    public realizar_movimiento(): void;
}
declare class Recoger extends Movimiento {
    public iniciar_animacion(): void;
    public actualizar(): boolean;
}
declare class Hablar extends MoverHaciaDerecha {
    public contador: any;
    public iniciar_animacion(): void;
    public realizar_movimiento(): void;
}
declare class AlienMarron extends Actor {
    public sombra: any;
    public limitar_movimientos: any;
    public sonido_blabla: any;
    public cuando_busca_recoger: any;
    constructor(x?: number, y?: number);
    public iniciar(): void;
    public decir(mensaje: any): void;
    public super_decir(mensaje: any): void;
    public actualizar(): void;
    public avanzar_animacion(): any;
    public ir_derecha(): void;
    public ir_izquierda(): void;
    public ir_arriba(): void;
    public ir_abajo(): void;
    public esperar(tiempo?: number): void;
    public detener(): void;
    public recoger(): void;
}
declare class Tuerca extends Actor {
    public y_original: any;
    public contador: any;
    public sombra: any;
    constructor(x: any, y: any);
    public actualizar(): void;
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
    public pilas: any;
    public Aceituna: any;
    public Actor: any;
    public Bomba: any;
    public Explosion: any;
    public Nave: any;
    public Proyectil: any;
    public Piedra: any;
    public Eje: any;
    public Maton: any;
    public Globo: any;
    public Texto: any;
    public Bloque: any;
    public Manzana: any;
    public Cofre: any;
    public Llave: any;
    public Caja: any;
    public Cesto: any;
    public Pelota: any;
    public Zanahoria: any;
    public Boton: any;
    public Puntaje: any;
    public Mono: any;
    public Banana: any;
    public Tortuga: any;
    public Pizarra: any;
    public Pingu: any;
    public Alien: any;
    public AlienMarron: any;
    public Tuerca: any;
    public Sombra: any;
    constructor(pilas: any);
}
