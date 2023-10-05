import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = "ChuyHaciendoJueguito";

moduloActividad(nombre, () =>{

	actividadTest(nombre, {
		solucion: `<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><shadow type="required_statement"></shadow><block type="Avanzar"><next><block type="procedures_callnoreturn"><mutation name="Calentar"></mutation><next><block type="RecogerPulpito"><next><block type="procedures_callnoreturn"><mutation name="HacerJueguito"></mutation><next><block type="Volver"></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" x="299" y="83"><field name="NAME">Calentar</field><statement name="STACK"><block type="Avanzar"><next><block type="Retroceder"></block></next></block></statement></block><block type="procedures_defnoreturn" x="229" y="200"><field name="NAME">HacerJueguito</field><statement name="STACK"><block type="RevolearPulpito"><next><block type="RebotarPiePulpito"></block></next></block></statement></block></xml>`
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Invirtiendo acciones sigue funcionando la solución',
		solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\"></shadow><block type=\"Avanzar\"><next><block type=\"procedures_callnoreturn\"><mutation name=\"Calentar\"></mutation><next><block type=\"RecogerPulpito\"><next><block type=\"procedures_callnoreturn\"><mutation name=\"HacerJueguito\"></mutation><next><block type=\"Volver\"></block></next></block></next></block></next></block></next></block></statement></block><block type=\"procedures_defnoreturn\" x=\"299\" y=\"83\"><field name=\"NAME\">Calentar</field><statement name=\"STACK\"><block type=\"Retroceder\"><next><block type=\"Avanzar\"></block></next></block></statement></block><block type=\"procedures_defnoreturn\" x=\"229\" y=\"200\"><field name=\"NAME\">HacerJueguito</field><statement name=\"STACK\"><block type=\"RebotarPiePulpito\"><next><block type=\"RevolearPulpito\"></block></next></block></statement></block></xml>"`
	});

});