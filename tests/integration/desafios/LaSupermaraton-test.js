import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = '1026';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
				<xml xmlns="http://www.w3.org/1999/xhtml">
   					<block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0">
      					<statement name="program">
         					<block type="Repetir" id="26" inline="true">
            					<value name="count">
               						<block type="KmsTotales" id="29" />
            					</value>
           					 	<statement name="block">
               						<block type="Avanzar1kmChuy" id="12" />
            					</statement>
         					</block>
      					</statement>
   					</block>
				</xml>`,
	});
	
	actividadTest(nombre, {
		descripcionAdicional: 'Da error al querer correr más de lo que debería',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="3LvxGwp!/!4x~9Q,)#Mf" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><shadow type="required_statement" id="mc@Y6W3Etlg~$QY_MFvb"></shadow><block type="repetir" id="y}W(J]}a:Gr*CQh!Wihz"><value name="count"><shadow type="required_value" id="gHF/Ky:zMDtpdtYzr,yj"></shadow><block type="math_number" id="GPuKE9|!H/2;GH:9_Kjn"><field name="NUM">100</field></block></value><statement name="block"><shadow type="required_statement" id="@k~Bx*lS*t[%4Yo?d{Ou"></shadow><block type="Avanzar1kmChuy" id="u3v2dXZ;8)yMVJs:8n!5"></block></statement></block></statement></block></xml>',
		errorEsperado: 'Ya llegué, ¡no debo seguir corriendo!',
	});
	
});