import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'InstalandoJuegos';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="193" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="212" inline="true"><value name="count"><block type="math_number" id="213"><field name="NUM">3</field></block></value><statement name="block"><block type="SiguienteCompu" id="221"><next><block type="procedures_callnoreturn" id="209"><mutation name="Procesar compu"></mutation></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="195" x="23" y="215"><mutation></mutation><field name="NAME">Procesar compu</field><statement name="STACK"><block type="PrenderCompu" id="229"><next><block type="procedures_callnoreturn" id="233"><mutation name="Ingresar password"></mutation><next><block type="InstalarJuego" id="241"><next><block type="ApagarCompu" id="249"></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="198" x="487" y="218"><mutation></mutation><field name="NAME">Ingresar password</field><statement name="STACK"><block type="EscribirA" id="257"><next><block type="EscribirB" id="265"><next><block type="EscribirC" id="273"></block></next></block></next></block></statement></block></xml>',
});

actividadTest(nombre, {
	descripcionAdicional: 'No debe poderse resolver la actividad si no están las tres máquinas instaladas',
	solucion: '<xml><block y="0" x="0" editable="false" movable="false" deletable="false" id="32" type="al_empezar_a_ejecutar"><statement name="program"><block id="35" type="SiguienteCompu"><next><block inline="true" id="33" type="repetir"><value name="count"><block id="34" type="math_number"><field name="NUM">3</field></block></value><statement name="block"><block id="36" type="procedures_callnoreturn"><mutation name="Procesar compu"></mutation></block></statement></block></next></block></statement></block><block y="215" x="23" id="37" type="procedures_defnoreturn"><mutation></mutation><field name="NAME">Procesar compu</field><statement name="STACK"><block id="38" type="PrenderCompu"><next><block id="39" type="procedures_callnoreturn"><mutation name="Ingresar password"></mutation><next><block id="40" type="InstalarJuego"><next><block id="41" type="ApagarCompu"></block></next></block></next></block></next></block></statement></block><block y="218" x="487" id="42" type="procedures_defnoreturn"><mutation></mutation><field name="NAME">Ingresar password</field><statement name="STACK"><block id="43" type="EscribirA"><next><block id="44" type="EscribirB"><next><block id="45" type="EscribirC"></block></next></block></next></block></statement></block></xml>',
	errorEsperado: 'Esta compu ya la prendiste antes',
});
