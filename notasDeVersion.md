Notas de versión detalladas
=============
Se presentan aquí notas de versión adicionales a las notas de versión aparecidas en la página [http://pilasbloques.program.ar/#/notasDeVersion](http://pilasbloques.program.ar/#/notasDeVersion). Las de esa página son exclusivamente de versiones disponibles al público, mientras que las que siguen son más detalladas, incluyendo cambios intermedios:

* 1.12 (18 de Agosto de 2022)
  * Se subió la versión de `ember-electron` a la `4.0.0` y se agregó la dependencia `electron-installer-debian` para poder empaquetar `deb`.
  * Se migraron los scripts de `post-install` de `bash` a `js`. Esto permite que funcionen correctamente tanto en `Windows` como en `macOS`.
  * Se disminuyó (potencialmente) el tiempo requerido para correr `npm install`. Además, se modificó la dependencia `electron-installer-debian` para que sea opcional debido a que traía problemas con `Windows`.
  * Se modificó la redacción del enunciado del desafío 38: Las rocas de Nano.
  * Se arregló un bug que ocasionaba que la aplicación deje de funcionar al correr las expectativas de `anidación de estructuras de control` cuando se llamaba a un procedimiento eliminado desde una estructura de control.
  * Se modificó el feedback mostrado al grupo de control para que el mismo sea generado a partir de la configuración del desafío, y no desde las expectativas que se pudieron correr.
  * Se agregó la IP al context, relacionado con https://github.com/Program-AR/pilas-bloques/issues/1113.
  * Se evitó que se frene la ejecución si las validaciones fallan. Además, ahora se envía el análisis estático correcto debido a que se hace luego de correr las validaciones.
  * El resultado de la 'expectativa' `solution works` ahora se calcula en todo momento, en lugar de enviar un valor fijo al backend.
  * Se agregó `markdown` al cuadro que muestra feedback con respecto a las expectativas.
  * Se codifican los nombres de las expectativas antes de enviarlos a `Mulang` debido a que si dichos nombres usaban tildes traían problemas (Mulang no devolvía los nombres con tildes). Más info acá: https://github.com/Program-AR/pilas-bloques/issues/1096.
  * Se arregló un bug que ocasionaba que el desafío "Nuevos comandos" no contara como ejercicio con la expectativa `decomposition`.
  * Se resolvió un bug que hacía que el score final del desafío se calculara mal si el mismo no tenía estructuras de control.
  * Se modificó el modal que muestra el feedback con respecto a las espectativas para que entre en alto en pantallas chicas.
  * Se subió la versión de `jshint` a la 11 para que permitiera el optional chaining.
  * Se agregó un archivo que contiene los `material icons` para que aparezcan en la aplicación aún si no tiene conexión a internet.
  * Se arregló un bug que hacía que se genere mal el AST cuando había un bloque "Repetir vacío".
  * Se arregló un bug que ocasionaba que el diálogo de fin de desafío se viera mal al achicar la pantalla.
  * Se quitó información no relevante asociada al análisis estático que se envía al backend. Ahora nos quedamos solamente con los ids de las expectativas y si pasó o no.
  * Se aumentó el límite de bloques posibles que puede tener un procedimiento para ser considerado demasiado largo en algunos desafíos (28, 39, 41, 42, 43).

* 1.11.1 (22 de Agosto de 2022)
  * Se agregó mulang.js, ejecutándose cada vez que se hace play. Cuando mulang está cargando, el botón se grisa. En firefox tarda un poco más, especialmente la primera vez que se aprieta el botón en cada desafío.
  * Se agregaron las expectativas, desactivadas por feature flag por ahora. Se configuran a nivel desafío, capítulo y libro.
  * Modos de experimento: hay 4 formas de buildear la aplicación: "notAffected", "treatment", "control" y "autoassign". "notAffected" desactiva las expectativas y sugerencias, "treatment" las pone siempre, "control" genera sólo un diálogo final completo, y "autoassign" randomiza entre las últimas dos por IP.
  * Ahora los números de versión incluyen al final una letra de qué tipo de experimento es.
  * Se avanzó sobre la traduccion al portugués.
  * Se agregaron 9 nuevos desafíos, fundamentalmente de Alternativa Condicional.
  * Se sacó Python como requerimiento del proyecto.
  * Ahora se consigue la lista de imágenes apartir del pilas-bloques-exercises.
  * Pilas Bloques ahora entra en pantallas de 768px.
  * Se resolvió que se perdía el código al poner pantalla completa.
  * Se sacó la flecha de múltiples escenarios del pilas-bloques-exercises y se la implementó en la aplicación misma.
  * Se agregaron scripts al hacer el post-install, debido a lo que se dice en https://github.com/Program-AR/pilas-bloques/pull/968 , https://github.com/Program-AR/pilas-bloques/issues/981 y https://github.com/Program-AR/pilas-bloques/issues/1006.
  * Se agregaron scripts para generar y usar archivos de traducción mas human friendly.
  * Se wrappean los textos de los bubbles de warning y errores.
  * Ahora los bubbles mantienen el color al volverse a abrir.
  * Se agregó caducidad a los tokens de login.
  * Ahora el fingerprint se guarda en el local storage y se lo genera de forma lazy.
  * Ahora se envia la URL a la API en el context, debido a https://github.com/Program-AR/pilas-bloques/issues/1044.
  * Se subió la versión de Node de dubnium a fermium.
  * Se subió la versión de electron a 15.5.5.
  * Se subió la versión de moment a 2.29.4.
  * Se sacó la dependencia de devtron.

* 1.9.3 (4 de Mayo de 2022)
  * Se solucionó el bug que te hacía perder la solución al hacer _"pantalla completa"_.

* 1.9.2 (8 de abril de 2022)
  * ¡Ahora Pilas Bloques está disponible en inglés!
  * Agregamos un botón de selección de idiomas.
  * Tenemos un modo de lectura simple, apropiado para las personas que lo necesiten.
  * En el primer ciclo, ¡Podemos movernos entre desafíos!. Para ello agregamos botones para ir al anterior y al siguiente.
  * Ahora se mantiene el modo turbo al cambiar de desafío
  * Se dividieron las traducciones en varios archivos. Para hacer esto se tuvo que hacer la dependencia `pilas-bloques-ember-intl` para solucionar un bug de `ember-intl` respecto a las traducciones en Windows. Esta dependencia se debería [dejar de usar eventualmente](https://github.com/Program-AR/pilas-bloques/issues/910).
  * Se internacionalizaron las categorías de bloques.
  * Se internacionalizó `proceds-blockly`.
  * La traducción al inglés ahora tiene que estar completa para poder buildear Pilas Bloques.
  * Se empezó la traducción al portugués. Actualmente está incompleta, así que no está habilitada su selección en el selector de idiomas.
  * Se arregló que, a veces, el orden en el que aparecían los libros era aleatorio.
  * Se hizo un refactor de la lógica relacionada a ejecutar un desafío en https://github.com/Program-AR/pilas-bloques/pull/878.
  * Se bumpeó la versión de Electron de 15.2.0 a 15.3.5. 
  * Se fijó la versión de `ember-paper` a la `1.0.0-beta.35` por problemas de compatibilidad.
  * Se sacó la dependencia de `pilasweb` del `package.json` porque ya viene con `pilas-bloques-exercises`.
  
* 1.8.0 (5 de noviembre de 2021) ¡Tecnópolis!
  * Se agregó un tercer libro, el libro "Tecnópolis", donde aparecen varios desafíos que también podrán realizarse "en el mundo real" en el stand de Pilas Bloques en Tecnópolis 2021, por 7 fines de semana empezando el 5/11/2021.
  * Además, en ese libro hay algunos desafíos bonus con Toto, Coty, Lita y Duba, algunos ya existentes en 1er ciclo de primaria y otros nuevos.
  * Como parte de la colaboración con el equipo de voluntarios de Salesforce, se agregó la posibilidad de internacionalizar la aplicación con ember-intl. En las próximas versiones saldrá la posibilidad de tener Pilas Bloques en inglés.
  * También parte de ese trabajo colaborativo fue agregar la posibilidad de tener enunciados con Markdown (y agregar links, negritas, emojis, etc.) usando ember-cli-showdown. Lamentablemente pocos enunciados por ahora lo tienen, pero ahora está la posibilidad.
  * Se agrega diálogo de aceptación de términos de servicio para tode usuarie.
  * Se avanza sobre una versión más completa del importador de actividades (aunque aún apagado por feature flag).

* 1.7.2 (21 de mayo de 2021)
  * ¡ Ahora Pilas Bloques permite registrarse! 
  * Pilas Bloques ahora tiene un backend, compuesto por dos servicios: [Pilas Bloques API](https://github.com/Program-AR/pilas-bloques-api) y [Pilas Bloques Analytics](https://github.com/Program-AR/pilas-bloques-analytics). 
    * En Analytics se guardan todas las soluciones de todo usuario registrado y sin registrar, tanto en formato XML como el AST.
    * En la API se guarda la info de usuarios registrados, credenciales, las respuestas a las preguntas demográficas, y la última solución por ejercicio. La API también envía los mails de recuperación de contraseña.
  * Se actualizaron dependencias y se resolvieron vulnerabilidades de seguridad.
  * Se deprecaron las rutas de cursoAlumno y cursoDocente, que en algún momento fueron utilizadas para una integración precaria con Moodle.
  * Ahora los scripts para correr y deployar la app no son más con Makefile, favoreciendo el desarrollo multiplataforma.
  * Se agregó con un feature flag el creador de desafíos diseñado por alumnos de UTN FRBA (sólo para desarrolladores)
  * Se arreglaron bugs variados. 

* 1.6.1 (24 de agosto de 2020)
  *  ¡Rediseñamos la pantalla de bienvenida y las fuentes usadas en la aplicación! Ahora esta posee un diseño más elegante.
  *  Las versiones de escritorio de la aplicación comienzan maximizadas al iniciarlas.
  *  Al finalizar la ejecución de un ejercicio, ahora se muestra el botón "Reiniciar" en vez de "Ejecutar".
  *  Al Intentar guardar la solución de un ejercicio ya no salta ningún cartel de error.
  *  El botón del modo turbo vuelve a mostrar un color brillante para denotar que está activado.
  *  Se soluciona problema que permitía resolver el ejercicio Fútbol para robots sin la necesidad de patear todas las pelotas.
  *  Se cambió el nombre y el icono del bloque "abrir el cofre" por "abrir el cofre y tomar sombrero" en el ejercicio La aventura del mar encantado.

* 1.6.0 (20 de Julio de 2020)
  *  ¡Rediseñamos la aplicación! Ahora la página se puede ver y usar mejor en dispositivos como celulares y tablets. 
  *  La nueva disposición privilegia los bloques poniéndolos a la izquierda y poniéndoles un ancho mínimo para que en cualquier pantalla haya lugar para los mismos.
  *  Tenemos una cabecera nueva, que muestra el libro, capítulo y desafío actual, con la idea de "breadcrumb". Ocupa menos alto que antes, y al acortarse se adapta al tamaño reduciendo el contenido textual. 
  *  Cuando la cabecera no tiene espacio, el "breadcrumb" se transforma en un "burger menu", desplegable.
  *  Tenemos un modo nocturno, apropiado para descansar la vista, o por gusto personal. Pone el fondo oscuro y adecúa los colores.
  *  El enunciado y las pistas están visibles arriba de todo, y se puede alternar entre el enunciado y las pistas.
  *  Se agrega un recordatoroio de rotado del dispositivo para usarse en modo horizontal cuando no alcanza el espacio.
  *  Ahora el tamaño del escenario se ajusta al tamaño de la pantalla, creciendo al máximo de ancho (420px) sólo si tiene lugar.
  *  Se agrega el modo "pantalla completa", que sirve para tener toda la pantalla disponible para poder programar, y la posibilidad de ocultar el escenario mientras se programa (o tenerlo como miniatura móvil).
  *  Utilizamos "meta viewport" para escalar (reducir) el tamaño de la aplicación cuando se abre en celulares, lo que nos permite, junto con unos pocos media queries, que se pueda ver en todas las resoluciones que figuraban en Analytics.
  *  Ahora las imágenes de los libros se ven bien en celulares. 
  *  Se actualiza la flecha "Ejecutá varias veces" para que apunte a la nueva posición del botón Ejecutar y que diga algo más adecuado conceptualmente: "Hay varios escenarios".
  *  Ahora las barras de navegación horizontales y verticales aparecen cuando a Pilas Bloques no le alcanza el tamaño para mostrarse, así se puede navegar por la aplicación aunque la pantalla sea pequeña.

* 1.5.2 (27 de Septiembre de 2019)
  * Al ejecutar siempre se actualizan los escenarios aleatorios.
  * Se permite ejecutar soluciones con proccedimientos vacíos.
  * Se arreglan algunos errores con el orden en que aparecen las categorías con los bloques disponibles.

* 1.5.0 (19 de Agosto de 2019)
  * ¡Actualizamos la versión de Ember! Esto permitió resolver algunos problemas de vulnerabilidad en la aplicación y la actualización de varias dependencias.
  * Se grisan los bloques que dejan de funcionar al borrar un parámetro de algún procedimiento.
  * Al importar una solución de otro ejercicio se grisan los bloques que no pertenecen a la actividad.
  * Se avisa de la presencia de bloques con "agujeros" al intentar ejecutar un programa con errores.
  * Se arreglan algunos problemas del instalador de Linux.

* 1.4.3 (2 de Julio de 2019)
  * ¡Nuevos bloques de procedimientos! Que mejoran la usabilidad para agregar parámetros. Esto se logra utilizando el proyecto [proceds-blockly](https://github.com/Program-AR/proceds-blockly) que es el mismo que utiliza nuestra herramienta hermana Gobstones Web.
  * Ahora al ejecutar una solución con procedimientos se resalta tanto el bloque que se está ejecutando como la llamada al procedimiento, si es debido.
  * Se sacaron los condicionales de los ejercicios de Dibujo Libre ya que no cuentan con sensores para usarlos.
  * Se agregaron íconos faltantes en algunos bloques de la actividad "Instalando juegos".
  * Se sacaron algunos alias innecesarios de bloques.
  * Se cambiaron los nombres de algunos métodos intervenientes de las colisiones de los actores.
  * Se actualizó la versión de Electron.
  * Se arreglan los siguientes bugs:
    * No mostraba el bloque "Al empezar a Ejecutar" en Wondows XP.
    * Errores en las ventanas de guardar o cargar una solución spbq en Windows.
    * Error al intentar dividir por 0.
    * Error al querer prender una computadora que ya está prendida en "Prendiendo las compus".
    * Mejoras al detectar una solución correcta en "Instalando juegos".
    * Comportamientos extraños al crear y usar los bloques de procedimientos.
  * Se agregan tests sobre:
    * Soluciones alternativas a "Dibujando: Escalera cuadrada".
    * Colisiones e interacción de los actores.
    * Retrocompatibilidad de los alias de los bloques.

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
