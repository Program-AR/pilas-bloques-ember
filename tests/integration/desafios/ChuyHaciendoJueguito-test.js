import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = "ChuyHaciendoJueguito";

moduloActividad(nombre, () =>{

	actividadTest(nombre, {
		solucion: `<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><shadow type="required_statement"></shadow><block type="Avanzar"><next><block type="procedures_callnoreturn"><mutation name="Calentar"></mutation><next><block type="RecogerPulpito"><next><block type="procedures_callnoreturn"><mutation name="HacerJueguito"></mutation><next><block type="Retroceder"></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" x="299" y="83"><field name="NAME">Calentar</field><statement name="STACK"><block type="Avanzar"><next><block type="Retroceder"></block></next></block></statement></block><block type="procedures_defnoreturn" x="229" y="200"><field name="NAME">HacerJueguito</field><statement name="STACK"><block type="RevolearPulpito"><next><block type="RebotarPiePulpito"></block></next></block></statement></block></xml>`
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Invirtiendo acciones sigue funcionando la solución',
		solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\"><variables></variables><block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\"><statement name=\"program\"><shadow type=\"required_statement\"></shadow><block type=\"Avanzar\"><next><block type=\"procedures_callnoreturn\"><mutation name=\"Calentar\"></mutation><next><block type=\"RecogerPulpito\"><next><block type=\"procedures_callnoreturn\"><mutation name=\"HacerJueguito\"></mutation><next><block type=\"Retroceder\"></block></next></block></next></block></next></block></next></block></statement></block><block type=\"procedures_defnoreturn\" x=\"299\" y=\"83\"><field name=\"NAME\">Calentar</field><statement name=\"STACK\"><block type=\"Retroceder\"><next><block type=\"Avanzar\"></block></next></block></statement></block><block type=\"procedures_defnoreturn\" x=\"229\" y=\"200\"><field name=\"NAME\">HacerJueguito</field><statement name=\"STACK\"><block type=\"RebotarPiePulpito\"><next><block type=\"RevolearPulpito\"></block></next></block></statement></block></xml>"`
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error al no seguir la secuencia esperada',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="8O=exD$F3=:_5wwm@Rz%" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><shadow type="required_statement" id="`vmtRyF)]_|/f?R);lOM"></shadow><block type="procedures_callnoreturn" id="CeBZFP?qRU%=p9Wi)XR="><mutation name="HacerJueguito"></mutation><next><block type="Retroceder" id="/|_Mh[Iz6Bv(vmAx-!gX"><next><block type="Avanzar" id="h:.~1Q8on)sp5+qA%C=?"><next><block type="procedures_callnoreturn" id="%VR?e)*,cRKd8I,ES0IZ"><mutation name="Calentar"></mutation><next><block type="RecogerPulpito" id="@?3v[lMO$z*tS?gEPc3s"></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="r.2M2haQ5Odx0REB$?$j" x="299" y="83"><field name="NAME">Calentar</field><statement name="STACK"><block type="Avanzar" id="w!ZKhN]E]!PVH4QF(;u("><next><block type="Retroceder" id="y=L?JR;ZO2e3DfauQTo1"></block></next></block></statement></block><block type="procedures_defnoreturn" id="leyRY*v.*t_+OdoWQ.po" x="229" y="200"><field name="NAME">HacerJueguito</field><statement name="STACK"><block type="RevolearPulpito" id="G.tP]pAjhR*iTIDwQ}cP"><next><block type="RebotarPiePulpito" id="OcD([58?~Q`rMn{do-t)"></block></next></block></statement></block></xml>',
		errorEsperado: 'Primero hay que entrar en calor y agarrar la pelota'
	});

});