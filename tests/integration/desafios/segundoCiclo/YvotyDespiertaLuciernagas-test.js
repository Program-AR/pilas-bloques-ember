import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

const nombre = 'YvotyDespiertaLuciernagas';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="45" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="MoverACasillaArriba" id="115"><next><block type="procedures_callnoreturn" id="59"><mutation name="despertar diagonal"></mutation><next><block type="procedures_callnoreturn" id="144"><mutation name="acomodarse en la otra diagonal"></mutation><next><block type="procedures_callnoreturn" id="156"><mutation name="despertar diagonal"></mutation></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="56" x="22" y="172"><mutation></mutation><field name="NAME">despertar diagonal</field><statement name="STACK"><block type="Repetir" id="76" inline="true"><value name="count"><block type="math_number" id="77"><field name="NUM">3</field></block></value><statement name="block"><block type="DespertarLuciernaga" id="65"><next><block type="MoverACasillaDerecha" id="86"><next><block type="MoverACasillaArriba" id="92"></block></next></block></next></block></statement><next><block type="DespertarLuciernaga" id="98"></block></next></block></statement></block><block type="procedures_defnoreturn" id="109" x="22" y="380"><mutation></mutation><field name="NAME">acomodarse en la otra diagonal</field><statement name="STACK"><block type="Repetir" id="122" inline="true"><value name="count"><block type="math_number" id="123"><field name="NUM">4</field></block></value><statement name="block"><block type="MoverACasillaAbajo" id="129"></block></statement><next><block type="MoverACasillaIzquierda" id="135"></block></next></block></statement></block></xml>',
	});

});