import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = '1003';

moduloActividad(nombre, () => {

	// Solución esperada. Usa el bloque Repetir
	actividadTest(nombre, {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="13" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Repetir" id="14" inline="true"><value name="count"><block type="math_number" id="15"><field name="NUM">30</field></block></value><statement name="block"><block type="RebotarUnaVezPingPong" id="16"></block></statement></block></statement></block></xml>',
	});

	// Solución alternativa donde no usa el bloque Repetir y ejecuta 30 bloques saltar seguidos.
	actividadTest(nombre, {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="46" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="RebotarUnaVezPingPong" id="109"><next><block type="RebotarUnaVezPingPong" id="107"><next><block type="RebotarUnaVezPingPong" id="105"><next><block type="RebotarUnaVezPingPong" id="103"><next><block type="RebotarUnaVezPingPong" id="101"><next><block type="RebotarUnaVezPingPong" id="99"><next><block type="RebotarUnaVezPingPong" id="97"><next><block type="RebotarUnaVezPingPong" id="95"><next><block type="RebotarUnaVezPingPong" id="93"><next><block type="RebotarUnaVezPingPong" id="91"><next><block type="RebotarUnaVezPingPong" id="89"><next><block type="RebotarUnaVezPingPong" id="87"><next><block type="RebotarUnaVezPingPong" id="85"><next><block type="RebotarUnaVezPingPong" id="83"><next><block type="RebotarUnaVezPingPong" id="81"><next><block type="RebotarUnaVezPingPong" id="79"><next><block type="RebotarUnaVezPingPong" id="77"><next><block type="RebotarUnaVezPingPong" id="75"><next><block type="RebotarUnaVezPingPong" id="73"><next><block type="RebotarUnaVezPingPong" id="71"><next><block type="RebotarUnaVezPingPong" id="69"><next><block type="RebotarUnaVezPingPong" id="67"><next><block type="RebotarUnaVezPingPong" id="65"><next><block type="RebotarUnaVezPingPong" id="63"><next><block type="RebotarUnaVezPingPong" id="61"><next><block type="RebotarUnaVezPingPong" id="59"><next><block type="RebotarUnaVezPingPong" id="57"><next><block type="RebotarUnaVezPingPong" id="55"><next><block type="RebotarUnaVezPingPong" id="51"><next><block type="RebotarUnaVezPingPong" id="53"></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>',
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al querer saltar más de 30 veces',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="Repetir" id="4" inline="true"><value name="count"><block type="math_number" id="5"><field name="NUM">31</field></block></value><statement name="block"><block type="RebotarUnaVezPingPong" id="7"></block></statement></block></statement></block></xml>',
		errorEsperado: ' ¡Uy! Hice muchos rebotes... ¡Me pasé!',
	});

});
