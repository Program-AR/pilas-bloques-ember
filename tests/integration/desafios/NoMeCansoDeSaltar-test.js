import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'NoMeCansoDeSaltar';

moduloActividad(nombre);

// Solución esperada. Usa el bloque Repetir
actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="13" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="14" inline="true"><value name="count"><block type="math_number" id="15"><field name="NUM">30</field></block></value><statement name="block"><block type="saltar1" id="16"></block></statement></block></statement></block></xml>',
});

// Solución alternativa donde no usa el bloque Repetir y ejecuta 30 bloques saltar seguidos.
actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="46" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="saltar1" id="109"><next><block type="saltar1" id="107"><next><block type="saltar1" id="105"><next><block type="saltar1" id="103"><next><block type="saltar1" id="101"><next><block type="saltar1" id="99"><next><block type="saltar1" id="97"><next><block type="saltar1" id="95"><next><block type="saltar1" id="93"><next><block type="saltar1" id="91"><next><block type="saltar1" id="89"><next><block type="saltar1" id="87"><next><block type="saltar1" id="85"><next><block type="saltar1" id="83"><next><block type="saltar1" id="81"><next><block type="saltar1" id="79"><next><block type="saltar1" id="77"><next><block type="saltar1" id="75"><next><block type="saltar1" id="73"><next><block type="saltar1" id="71"><next><block type="saltar1" id="69"><next><block type="saltar1" id="67"><next><block type="saltar1" id="65"><next><block type="saltar1" id="63"><next><block type="saltar1" id="61"><next><block type="saltar1" id="59"><next><block type="saltar1" id="57"><next><block type="saltar1" id="55"><next><block type="saltar1" id="51"><next><block type="saltar1" id="53"></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>',
});

actividadTest(nombre, {
	descripcionAdicional: 'Da error al querer saltar más de 30 veces',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="4" inline="true"><value name="count"><block type="math_number" id="5"><field name="NUM">31</field></block></value><statement name="block"><block type="saltar1" id="7"></block></statement></block></statement></block></xml>',
	errorEsperado: '¡Uy! Salté mucho... ¡Me pasé!',
});
