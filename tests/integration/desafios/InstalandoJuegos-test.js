import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

const nombre = 'InstalandoJuegos';

moduloActividad(nombre);

actividadTest(nombre, {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="193" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="212" inline="true"><value name="count"><block type="math_number" id="213"><field name="NUM">3</field></block></value><statement name="block"><block type="SiguienteCompu" id="221"><next><block type="procedures_callnoreturn" id="209"><mutation name="Procesar compu"></mutation></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="195" x="23" y="215"><mutation></mutation><field name="NAME">Procesar compu</field><statement name="STACK"><block type="PrenderCompu" id="229"><next><block type="procedures_callnoreturn" id="233"><mutation name="Ingresar password"></mutation><next><block type="InstalarJuego" id="241"><next><block type="ApagarCompu" id="249"></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="198" x="487" y="218"><mutation></mutation><field name="NAME">Ingresar password</field><statement name="STACK"><block type="EscribirA" id="257"><next><block type="EscribirB" id="265"><next><block type="EscribirC" id="273"></block></next></block></next></block></statement></block></xml>',
});

actividadTest(nombre, {
	descripcionAdicional: 'No debe poderse resolver la actividad si no están las tres máquinas instaladas',
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="12" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="13" inline="true"><value name="count"><block type="math_number" id="14"><field name="NUM">3</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="16"><mutation name="Procesar compu"></mutation></block></statement></block></statement></block><block type="procedures_defnoreturn" id="22" x="278" y="21"><mutation></mutation><field name="NAME">Ingresar password</field><statement name="STACK"><block type="EscribirA" id="23"><next><block type="EscribirB" id="24"><next><block type="EscribirC" id="25"></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="17" x="7" y="146"><mutation></mutation><field name="NAME">Procesar compu</field><statement name="STACK"><block type="PrenderCompu" id="18"><next><block type="procedures_callnoreturn" id="19"><mutation name="Ingresar password"></mutation><next><block type="InstalarJuego" id="20"><next><block type="ApagarCompu" id="21"></block></next></block></next></block></next></block></statement></block></xml>',
	errorEsperado: 'Esta compu ya la prendiste antes',
});
