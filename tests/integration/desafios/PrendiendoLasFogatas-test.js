import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'PrendiendoLasFogatas';

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
  <xml xmlns="http://www.w3.org/1999/xhtml">
   <block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0">
      <statement name="program">
         <block type="procedures_callnoreturn" id="3" inline="true">
            <mutation name="Avanzar prendiendo hacia">
               <arg name="direccion" />
            </mutation>
            <value name="ARG0">
               <block type="ParaLaDerecha" id="47" />
            </value>
            <next>
               <block type="procedures_callnoreturn" id="4" inline="true">
                  <mutation name="Avanzar prendiendo hacia">
                     <arg name="direccion" />
                  </mutation>
                  <value name="ARG0">
                     <block type="ParaAbajo" id="65" />
                  </value>
                  <next>
                     <block type="procedures_callnoreturn" id="5" inline="true">
                        <mutation name="Avanzar prendiendo hacia">
                           <arg name="direccion" />
                        </mutation>
                        <value name="ARG0">
                           <block type="ParaLaIzquierda" id="53" />
                        </value>
                        <next>
                           <block type="procedures_callnoreturn" id="6" inline="true">
                              <mutation name="Avanzar prendiendo hacia">
                                 <arg name="direccion" />
                              </mutation>
                              <value name="ARG0">
                                 <block type="ParaArriba" id="77" />
                              </value>
                           </block>
                        </next>
                     </block>
                  </next>
               </block>
            </next>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="7" x="25" y="238">
      <mutation>
         <arg name="direccion" />
      </mutation>
      <field name="NAME">Avanzar prendiendo hacia</field>
      <statement name="STACK">
         <block type="Repetir" id="8" inline="true">
            <value name="count">
               <block type="math_number" id="9">
                  <field name="NUM">6</field>
               </block>
            </value>
            <statement name="block">
               <block type="procedures_callnoreturn" id="10" inline="true">
                  <mutation name="Avanzar hacia">
                     <arg name="direccion" />
                  </mutation>
                  <value name="ARG0">
                     <block type="param_get" id="11">
                        <field name="VAR">direccion</field>
                     </block>
                  </value>
                  <next>
                     <block type="procedures_callnoreturn" id="12">
                        <mutation name="Prender si hay fogata" />
                     </block>
                  </next>
               </block>
            </statement>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="13" x="270" y="363">
      <mutation />
      <field name="NAME">Prender si hay fogata</field>
      <statement name="STACK">
         <block type="si" id="14" inline="true">
            <value name="condition">
               <block type="TocandoFogata" id="15" />
            </value>
            <statement name="block">
               <block type="PrenderFogata" id="16" />
            </statement>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="17" x="1" y="514">
      <mutation>
         <arg name="direccion" />
      </mutation>
      <field name="NAME">Avanzar hacia</field>
      <statement name="STACK">
         <block type="si" id="18" inline="true">
            <value name="condition">
               <block type="logic_compare" id="19" inline="true">
                  <field name="OP">EQ</field>
                  <value name="A">
                     <block type="param_get" id="20">
                        <field name="VAR">direccion</field>
                     </block>
                  </value>
                  <value name="B">
                     <block type="ParaLaDerecha" id="93" />
                  </value>
               </block>
            </value>
            <statement name="block">
               <block type="MoverACasillaDerecha" id="22" />
            </statement>
            <next>
               <block type="si" id="23" inline="true">
                  <value name="condition">
                     <block type="logic_compare" id="24" inline="true">
                        <field name="OP">EQ</field>
                        <value name="A">
                           <block type="param_get" id="25">
                              <field name="VAR">direccion</field>
                           </block>
                        </value>
                        <value name="B">
                           <block type="ParaLaIzquierda" id="99" />
                        </value>
                     </block>
                  </value>
                  <statement name="block">
                     <block type="MoverACasillaIzquierda" id="27" />
                  </statement>
                  <next>
                     <block type="si" id="28" inline="true">
                        <value name="condition">
                           <block type="logic_compare" id="29" inline="true">
                              <field name="OP">EQ</field>
                              <value name="A">
                                 <block type="param_get" id="30">
                                    <field name="VAR">direccion</field>
                                 </block>
                              </value>
                              <value name="B">
                                 <block type="ParaArriba" id="105" />
                              </value>
                           </block>
                        </value>
                        <statement name="block">
                           <block type="MoverACasillaArriba" id="32" />
                        </statement>
                        <next>
                           <block type="si" id="33" inline="true">
                              <value name="condition">
                                 <block type="logic_compare" id="34" inline="true">
                                    <field name="OP">EQ</field>
                                    <value name="A">
                                       <block type="param_get" id="35">
                                          <field name="VAR">direccion</field>
                                       </block>
                                    </value>
                                    <value name="B">
                                       <block type="ParaAbajo" id="111" />
                                    </value>
                                 </block>
                              </value>
                              <statement name="block">
                                 <block type="MoverACasillaAbajo" id="37" />
                              </statement>
                           </block>
                        </next>
                     </block>
                  </next>
               </block>
            </next>
         </block>
      </statement>
   </block>
</xml>`,


   });

   actividadTest(nombre, {
      descripcionAdicional: 'Da error al querer avanzar hacia la izquierda si no hay camino',
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
              <xml xmlns="http://www.w3.org/1999/xhtml">
                <block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0">
                  <statement name="program">
                  <block type="MoverACasillaIzquierda" id="32" />
                </statement>
                </block>
              </xml>`,
      errorEsperado: 'No puedo ir para la izquierda',
   });

});