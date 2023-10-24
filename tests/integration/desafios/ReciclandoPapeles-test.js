import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = "ReciclandoPapeles";

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables><variable type="" id="Cuz=HO+m`105e)*2-+cS">cant. casilleros</variable></variables><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><shadow type="required_statement" id="9nNZNGjXJr]rIbff+2WD"></shadow><block type="procedures_callnoreturn" id="123"><mutation name="dejar regalos en fila"><arg name="cant. casilleros"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="math_number" id="125"><field name="NUM">4</field></block></value><next><block type="SiguienteFilaTotal" id="79"><next><block type="procedures_callnoreturn" id="82"><mutation name="dejar regalos en fila"><arg name="cant. casilleros"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="math_number" id="84"><field name="NUM">5</field></block></value><next><block type="SiguienteFilaTotal" id="88"><next><block type="procedures_callnoreturn" id="99"><mutation name="dejar regalos en fila"><arg name="cant. casilleros"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="math_number" id="115"><field name="NUM">7</field></block></value><next><block type="SiguienteFilaTotal" id="96"><next><block type="procedures_callnoreturn" id="102"><mutation name="dejar regalos en fila"><arg name="cant. casilleros"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="math_number" id="113"><field name="NUM">3</field></block></value><next><block type="SiguienteFilaTotal" id="92"><next><block type="procedures_callnoreturn" id="105"><mutation name="dejar regalos en fila"><arg name="cant. casilleros"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="math_number" id="111"><field name="NUM">6</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block><block type="Colocar" id="$seF/[gm`Z@qib)ec{Yr" x="0" y="0"></block><block type="procedures_defnoreturn" id="38" x="11" y="351"><mutation><arg name="cant. casilleros"></arg></mutation><field name="NAME">dejar regalos en fila</field><field name="ARG0">cant. casilleros</field><statement name="STACK"><block type="TomarPapel" id="(@i18^326P;8FY}0@Tsi"><next><block type="Repetir" id="51"><value name="count"><shadow type="required_value" id="Q!`owDTrmTGG+$2$1)w*"></shadow><block type="param_get" id="56"><mutation var="cant. casilleros"></mutation></block></value><statement name="block"><shadow type="required_statement" id="fvVo/A]R5-x;mEy/26BD"></shadow><block type="MoverACasillaDerecha" id="60"></block></statement><next><block type="Colocar" id="ZgH(^dLZ?!WP(OS7sxeM"></block></next></block></next></block></statement></block></xml>',
   });

   actividadTest(nombre, {
      descripcionAdicional: ' Da error al querer tirar un papel sin levantarlo primero',
      solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables><variable type="" id="Cuz=HO+m`105e)*2-+cS">cant. casilleros</variable></variables><block type="al_empezar_a_ejecutar" id="1" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><shadow type="required_statement" id="??F74Z;8i]hncRa3BtCI"></shadow><block type="procedures_callnoreturn" id="123"><mutation name="dejar regalos en fila"><arg name="cant. casilleros = 4"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="math_number" id="125"><field name="NUM">4</field></block></value><next><block type="SiguienteFilaTotal" id="79"><next><block type="procedures_callnoreturn" id="82"><mutation name="dejar regalos en fila"><arg name="cant. casilleros = 4"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="math_number" id="84"><field name="NUM">5</field></block></value><next><block type="SiguienteFilaTotal" id="88"><next><block type="procedures_callnoreturn" id="99"><mutation name="dejar regalos en fila"><arg name="cant. casilleros = 4"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="math_number" id="115"><field name="NUM">7</field></block></value><next><block type="SiguienteFilaTotal" id="96"><next><block type="procedures_callnoreturn" id="102"><mutation name="dejar regalos en fila"><arg name="cant. casilleros = 4"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="math_number" id="113"><field name="NUM">3</field></block></value><next><block type="SiguienteFilaTotal" id="92"><next><block type="procedures_callnoreturn" id="105"><mutation name="dejar regalos en fila"><arg name="cant. casilleros = 4"></arg></mutation><value name="ARG0"><shadow xmlns="" type="required_value"/><block type="math_number" id="111"><field name="NUM">6</field></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="38" x="11" y="351"><mutation><arg name="cant. casilleros = 4"></arg></mutation><field name="NAME">dejar regalos en fila</field><field name="ARG0">cant. casilleros = 4</field><statement name="STACK"><block type="Repetir" id="51"><value name="count"><shadow type="required_value" id="Y8j,!DE0e2@77hi9e17q"></shadow><block type="param_get" id="56"><mutation var="cant. casilleros"></mutation></block></value><statement name="block"><shadow type="required_statement" id="_Fw+$.nO.$)!}PGx$?wy"></shadow><block type="MoverACasillaDerecha" id="60"></block></statement><next><block type="Colocar" id="ZgH(^dLZ?!WP(OS7sxeM"></block></next></block></statement></block></xml>',
      errorEsperado: 'No tengo nada en la mano'
   });

});