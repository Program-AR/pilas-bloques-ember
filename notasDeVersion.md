Notas de versión detalladas
=============

Se presentan aquí notas de versión adicionales a las notas de versión aparecidas en la página [http://pilasbloques.program.ar/#/notasDeVersion](http://pilasbloques.program.ar/#/notasDeVersion). Las de esa página son exclusivamente de versiones disponibles al público, mientras que las que siguen son más detalladas, incluyendo cambios intermedios:

* 1.4.2-beta (25 de Marzo de 2019)
  * Se agrega la posibilidad de ejecutar un ejercicio en "Modo turbo", lo cual aumenta la velocidad y evita las animaciones.
  * Ahora se precargan solamente las imágenes necesarias para cada desafío antes de comenzar, esto permite que la carga del ejercicio sea más rápida.
  * Se agrega el bloque "SaltarHaciaAdelante", que ejecuta el comportamiento para desplazarse sin dibujar en los desafíos de Dibujando.
  * Se agrega el comportamiento "Hundir" que lo usa Coty. También se agrega que tire error cuando Coty se va de la pantalla.
  * Se agrega la clase "Colisionable" para agregar comportamientos por colisión. Además se implementa una forma de extender comportamiento entre clases, usada por el Charco para ser Colisionable.
  * Se agrega un ejercicio de "Dibujo libre" en el libro del Segundo ciclo de primaria.
  * Actualizadas las condiciones de errores y resolución de los ejercicios de Lita. Así como la resolución del Desafío 2 de TopoTopo.
  * Refactor del componente pilas-blockly, encargado de la ejecución del intérprete de pilas.
  * Se usan las declaraciones de tipos de Pilas Web desde el paquete bower y se elimina el archivo del proyecto.
  * Se arreglan algunos bugs sobre:
    * El parámetro de los bloques DibujarLado y MoverDireccionDibujando.
    * Bloque de Procedimiento en "Coty dibuja libre".
    * Modo de lectura simple contempla los mensajes de error en Pilas Web.
  * Se agregan tests sobre:
    * Bloques con id que contengan el carácter '$'.
    * Ejercicios de Coty, Dibujante, Toto (Lector y Escritor).
    * Unitarios de la lógica del componente de pilas-blockly.

* 1.4.1-beta (1 de Noviembre de 2018)
  * Cambios en algunos nombres de desafíos.
  * Cambios cosméticos en los enunciados.

* 1.4.0-beta (12 de Octubre de 2018)
  * Se publican los dos libros existentes, cada libro con un conjunto de desafíos.
  * El nuevo "libro" del Primer Ciclo de primaria incluye 50 nuevas actividades, incluyendo conceptos de repetición simple y alternativa condicional.
  * Agregada una compilación secundaria de .deb. Crea una nueva aplicación, no reemplaza al anterior paquete de Debian. El paquete que genera se llama "pilasbloques", en lugar de "pilas-engine-bloques" como antes.
  * Se proveen nuevos comportamientos: (Escribir, Leer) que acompañan a los nuevos actores Letra.
  * Ahora existe una escena denominada EscenaDesdeMapa, que permite construir escenas a partir de una especificación hecha en un DSL (lenguaje de dominio específico).
  * Se revisó el mecanismo de precarga de imágenes de Pilas Engine Web para que no se pre-carguen todas las imágenes.
  * Se realizó un refactor completo de los dibujos, para poder hacer una comparación más certera entre el dibujo esperado y el realizado.
  * Ahora no se pausa Pilas Web ante un error, para permitir las animaciones de errores.
  * Todos los cambios [aquí](https://github.com/program-ar/pilas-bloques/compare/1.3.3...1.4.0)

* 1.3.3 (09 de Abril de 2018)
  * Se corrigen colores y enunciados después del primer betatest de 1.3.2.
  * Ahora se compilan versiones portables para Linux (alternativas a la instalación del .deb).

* 1.3.2 (10 de Enero de 2018)
  * El mayor cambio es la estructura interna: Existe la idea internamente (aunque por ahora oculta) de "libro" que agrupa un conjunto de actividades. Cada actividad y cada "libro" (manual) tienen un número, que se refleja en la URL (las url anteriores siguen siendo compatibles). Por ahora sigue habiendo un solo libro: el del Manual de Didactica de Programación y estamos trabajando en las actividades de un segundo libro.
  * Otro cambio interno: la forma de definir una actividad cambia: ahora la definición principal de una actividad es a través de un JSON, además de la escena hecha en Typescript usando PilasEngine Web, y una definición de los bloques centralizada en una biblioteca de bloques.
  * Además, ahora blockly está actualizado y es actualizable gracias a la integración con el proyecto [blockly-package](https://github.com/Program-AR/blockly-package).
  * Gracias a actualizar Blockly, se agrega deshacer y rehacer al workspace, y también zoom y foco cuando el workspace es chico/grande.
  * Ahora en todas las actividades se ilumina la instrucción que se está ejecutando.
  * En La gran aventura, corregido el Escapar para que requiera estar en la misma casilla que el unicornio. Además, las animaciones ocurren solapadas en los lugares que debería.
  * En Instalando Juegos, se corrigieron las animaciones de cada comando para que se distingan entre sí.
  * Laberinto con queso ahora pone un queso al principio para forzar una estrategia en particular.
  * Varios arreglos menores como alguna velocidad de ejecución, íconos, enunciados, y toolboxes incompletos.
  * Todos los cambios [aquí](https://github.com/program-ar/pilas-bloques/compare/1.1.2...1.3.3)


* 1.1.2 (24 de Enero de 2017)
  * El notificador de versiones ahora sólo funciona en la versión descargable/offline (y se arregló un bug de comparación que hacía que avisara aún cuando la versión instalada fuera nueva).
  * Se elimininó el feature de que la solución persista en la URL. Esto se hizo para que al compartir la URL no vaya por defecto con la solución asociada.
  * Las categorías vuelven a estar alineadas a izquierda.
  * En "No me canso de saltar", el salto se hace más rápido, y no tiene un pequeño bug visual.


* 1.1.0 (03 de Enero de 2017)
  * Se agregó un notificador de nueva versión para descargar.
  * Se hicieron arreglos sobre las animaciones y chequeos de actividad completada en: El gato en la calle, Tres naranjas, La gran aventura del mar encantado, Instalando Juegos, Tito (en todos sus sabores) y más.


* 1.0.9 (02 de Octubre de 2016)
  * Para testeo se deployan automáticamente en Travis dos ramas: master y develop.


* 1.0.8 (16 de Septiembre de 2016)
  * Se unifica la creación interna de bloques utilizando siempre AccionBuilder
  * Se migran tests unitarios de ejerciciosPilas


* 1.0.7 (14 de Septiembre de 2016)
  * Se agrega un deslizador para que se pueda ajustar manualmente el tamaño de la escena.


* 1.0.4 (02 de Septiembre de 2016)
  * Se realizan las primeras pruebas en Travis.


* 1.0.3 (31 de Agosto de 2016)
  * Se agrega pilasweb como dependencia de Bower.
  * Correcciones al Detective Chaparro y a Laberinto Con Queso.
  * Se integra a Git toda la historia del repositorio ejerciciosPilas.


* 1.0.1 (14 de Agosto de 2016)
  * Se migró la aplicación offline de Node-Webkit a Electron. Esto hace que 1) ya no se soporte Windows XP y 2) se pueda instalar más fácilmente en otras versiones de Debian no-Huayra.
  * Se cambiaron las actividades de Parametrización para que usen valores direcciones en vez de comparar por Strings.
  * Se realizaron mejoras generales en links externos y la integración con el sistema.
  * Se hizo adaptable el diseño visual de la aplicación
  * Se agrega el código actual a la URL para que en un refresh no se pierda lo programado.
  * Se hizo que Pilas Web esté contenido en un iframe, lo que hace más prolijo el estado de Javascript de la página.
  * Se comenzó la migración de actividades a models de ember (usando mirage). Ahora las actividades también se acceden por id numérico (es el default).
  * Se mejoró el framework de testeo de integración.
  * Se actualizó el Acerca De.
  * Cambio a NodeJS 4


* 1.0.0 (28 de Julio de 2016)
  * Incluye todos los desafíos hasta Parametrización Inclusive. Entonces, Pilas Bloques abarca todas las actividades del manual para docentes "La programación y su didáctica" sin el último capítulo (Interactividad).
  * Esto significa... ¡16 nuevas actividades! Con algunas mejoras respecto del manual para docentes. Por ejemplo, una mejora didácticamente importante es que no usamos strings.
  * ¡Ahora se pueden guardar soluciones a un archivo! (Y, por supuesto, cargar una solución desde un archivo)
  * En la propuesta del manual, se usaban "variables" para denotar funciones a falta de una mejor opción en Scratch. En un principio, en Pilas Bloques, se usó ese modelo. Pero ahora fue modificado para proveer un nombre apropiado: "Sensores numéricos".
  * Otra diferencia es que la categoría "Control" fue cambiada por dos categorías, "Repeticiones" y "Alternativas". ¿Por qué? Porque la visión de la programación como control de flujo es una visión _operativa_. Desde Program.AR creemos que la programación puede tener también una visión _declarativa_, que es más importante.
  * Algunas mejoras visuales, como los tableros (en Reparando la nave ó El Superviaje).
  * Ahora los íconos de los bloques están todos al inicio del bloque.
  * También se corrigió la redacción de los mismos.
  * Ahora las dos primeras actividades de "Alternativa condicional" avisan con una flecha que hay que volver a ejecutar para probar en varios escenarios.


* 0.11.0 (11 de Mayo de 2016)
  * Incluye todos los desafíos hasta Uso de Variables inclusive.
  * En "La gran aventura del mar encantado" se optó por una alternativa de personajes
 con menos prejuicios sociales, intentando abogar por igualdad de géneros.
 ¡Es la heroína quien debe rescatar al príncipe!
  * Se cambiaron los nombres de las categorías de bloques, la discusión conceptual
 continúa.
  * Se arreglaron los enunciados de los desafíos.
  * Se arreglaron los tableros que muestran contadores.
  * Se mejoró la integración con Analytics. Ahora se hace seguimiento por desafío visitado.


* 0.10.0 (03 de Marzo de 2016)
  * Primer versión con todos los desafíos hasta Alternativa Condicional inclusive.
