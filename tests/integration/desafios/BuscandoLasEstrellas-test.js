import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = "1130";

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
      <xml xmlns="http://www.w3.org/1999/xhtml">
         <block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0">
            <statement name="program">
               <block type="procedures_callnoreturn" id="3" inline="true">
                  <mutation name="Mover telescopio veces">
                     <arg name="veces" />
                  </mutation>
                  <value name="ARG0">
                     <block type="Numero" id="4">
                        <field name="NUM">5</field>
                     </block>
                  </value>
                  <next>
                     <block type="SiguienteTelescopio" id="5">
                        <next>
                           <block type="procedures_callnoreturn" id="6" inline="true">
                              <mutation name="Mover telescopio veces">
                                 <arg name="veces" />
                              </mutation>
                              <value name="ARG0">
                                 <block type="Numero" id="7">
                                    <field name="NUM">7</field>
                                 </block>
                              </value>
                              <next>
                                 <block type="SiguienteTelescopio" id="8">
                                    <next>
                                       <block type="procedures_callnoreturn" id="9" inline="true">
                                          <mutation name="Mover telescopio veces">
                                             <arg name="veces" />
                                          </mutation>
                                          <value name="ARG0">
                                             <block type="Numero" id="10">
                                                <field name="NUM">9</field>
                                             </block>
                                          </value>
                                          <next>
                                             <block type="ObservarConAmigos" id="11" />
                                          </next>
                                       </block>
                                    </next>
                                 </block>
                              </next>
                           </block>
                        </next>
                     </block>
                  </next>
               </block>
            </statement>
         </block>
         <block type="Procedimiento" id="12" x="23" y="254">
            <mutation>
               <arg name="veces" />
            </mutation>
            <field name="NAME">Mover telescopio veces</field>
            <statement name="STACK">
               <block type="Repetir" id="13" inline="true">
                  <value name="count">
                     <block type="param_get" id="14">
                        <field name="VAR">veces</field>
                     </block>
                  </value>
                  <statement name="block">
                     <block type="MoverTelescopio" id="15" />
                  </statement>
               </block>
            </statement>
         </block>
      </xml>`
   });



   actividadTest(nombre, {
		descripcionAdicional: 'Da error al mover menos veces el telescopio',
		solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="95Mku|KxPm9T$+2#6iex" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><shadow type="required_statement" id="xp_*#gEH/DXh%Z%o`lv~"></shadow><block type="RepetirVacio" id="nI.giWrqduFbu8{sJ~Oq"><value name="count"><shadow type="required_value" id="+rCO9a/JLQJiY5NirF}^"></shadow><block type="Numero" id="|}a|#kCvq?Y#9!{W-j0#"><field name="NUM">3</field></block></value><statement name="block"><shadow type="required_statement" id="*p[cohyUOr:+r:_kJHVf"></shadow><block type="MoverTelescopio" id="{Fwee)y*WWyUCL~^Eu{2"></block></statement><next><block type="SiguienteTelescopio" id="q6Gt[9tgIq!h7CGZ?q:e"><next><block type="RepetirVacio" id="aeK!X/xpR}VFg+k%)Z_^"><value name="count"><shadow type="required_value" id="a4.;AHG]ZM3Pv2XFM4R7"></shadow><block type="Numero" id="WfJRMWlN3c@rp:HdnkXJ"><field name="NUM">7</field></block></value><statement name="block"><shadow type="required_statement" id="tO@JXF?Q?X@V-RC96!.G"></shadow><block type="MoverTelescopio" id="GdWs{[O9fa*FMSFt!?0w"></block></statement><next><block type="SiguienteTelescopio" id="OE)uND|fZprdgqt7!ec,"><next><block type="RepetirVacio" id="$p-/,zNV^~5uXNMLM%EX"><value name="count"><shadow type="required_value" id="wt%SIUZo~PaMNASY2b76"></shadow><block type="Numero" id="yqJbjAK+Z!i8G4,Ih~^D"><field name="NUM">9</field></block></value><statement name="block"><shadow type="required_statement" id="@tNn{zd/S5ic3aZ@ETU8"></shadow><block type="MoverTelescopio" id="E`3UsA97NBXUZ2=meQ^Y"></block></statement><next><block type="ObservarConAmigos" id="qG?9Cn$X=FS-Y%{f88OM"></block></next></block></next></block></next></block></next></block></next></block></statement></block></xml>',
		errorEsperado: '¡El primer telescopio debe moverse 5 veces!'
	});
});