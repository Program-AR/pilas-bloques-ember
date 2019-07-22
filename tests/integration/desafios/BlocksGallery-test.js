import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'Blocks Gallery - aliases test';

moduloActividad(nombre, () => {

   actividadTest("InstalandoJuegos", {
      descripcionAdicional: 'Old Blocks works with new aliases implementation',
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
      <xml xmlns="http://www.w3.org/1999/xhtml">
         <variables />
         <block type="al_empezar_a_ejecutar" id="NLO52_{=EfQ]%h_Mvb-D" deletable="false" movable="false" editable="false" x="15" y="15">
            <statement name="program">
               <block type="repetir" id="LxS0hW-2K@kVVz_0a|ko">
                  <value name="count">
                     <block type="math_number" id="~9wRdqWoB;[8Uq]L?pc^">
                        <field name="NUM">3</field>
                     </block>
                  </value>
                  <statement name="block">
                     <block type="procedures_callnoreturn" id="n9WQk+A[t|W+.{sv@*Ry">
                        <mutation name="Instalar  juego en la siguente computadora" />
                     </block>
                  </statement>
               </block>
            </statement>
         </block>
         <block type="procedures_defnoreturn" id="%Q?:wvM/oV-woP8OJ]i+" x="14" y="171">
            <field name="NAME">Instalar  juego en la siguente computadora</field>
            <comment pinned="false" h="80" w="160">Describe esta funcin...</comment>
            <statement name="STACK">
               <block type="SiguienteCompu" id="%LIMS;TJ8SxvkOh|/_45">
                  <next>
                     <block type="PrenderCompu" id="~%^r2|]U@(c@/Juk~5i;">
                        <next>
                           <block type="EscribirA" id="_%Lq3f(1;$3X;AFr*{No">
                              <next>
                                 <block type="EscribirB" id="s_jPxakFyyhmdY1J2+mw">
                                    <next>
                                       <block type="EscribirC" id="S5saOm03Q?Gu9x;E#{5K">
                                          <next>
                                             <block type="InstalarJuego" id="R#{=LEdni#1:2d%EUQwn">
                                                <next>
                                                   <block type="ApagarCompu" id="cF{Zlxg/bjp)jBB.Yu^:" />
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
                  </next>
               </block>
            </statement>
         </block>
      </xml>`
   });

});