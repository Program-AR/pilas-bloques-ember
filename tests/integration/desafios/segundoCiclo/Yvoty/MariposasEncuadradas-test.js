import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

let nombre = "MariposasEncuadradas";

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
<xml xmlns="http://www.w3.org/1999/xhtml">
   <block type="al_empezar_a_ejecutar" id="13" deletable="false" movable="false" editable="false" x="0" y="0">
      <statement name="program">
         <block type="procedures_callnoreturn" id="14" inline="true">
            <mutation name="Observar mariposas hacia">
               <arg name="direccion" />
            </mutation>
            <value name="ARG0">
               <block type="ParaLaDerecha" id="15" />
            </value>
            <next>
               <block type="procedures_callnoreturn" id="20" inline="true">
                  <mutation name="Observar mariposas hacia">
                     <arg name="direccion" />
                  </mutation>
                  <value name="ARG0">
                     <block type="ParaAbajo" id="21" />
                  </value>
                  <next>
                     <block type="procedures_callnoreturn" id="16" inline="true">
                        <mutation name="Observar mariposas hacia">
                           <arg name="direccion" />
                        </mutation>
                        <value name="ARG0">
                           <block type="ParaLaIzquierda" id="17" />
                        </value>
                        <next>
                           <block type="procedures_callnoreturn" id="18" inline="true">
                              <mutation name="Observar mariposas hacia">
                                 <arg name="direccion" />
                              </mutation>
                              <value name="ARG0">
                                 <block type="ParaArriba" id="19" />
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
   <block type="procedures_defnoreturn" id="22" x="0" y="196">
      <mutation>
         <arg name="direccion" />
      </mutation>
      <field name="NAME">Observar mariposas hacia</field>
      <statement name="STACK">
         <block type="Repetir" id="23" inline="true">
            <value name="count">
               <block type="math_number" id="24">
                  <field name="NUM">6</field>
               </block>
            </value>
            <statement name="block">
               <block type="MoverA" id="25" inline="true">
                  <value name="direccion">
                     <block type="param_get" id="26">
                        <field name="VAR">direccion</field>
                     </block>
                  </value>
                  <next>
                     <block type="procedures_callnoreturn" id="27">
                        <mutation name="Observar mariposa si hay" />
                     </block>
                  </next>
               </block>
            </statement>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="28" x="2" y="363">
      <mutation />
      <field name="NAME">Observar mariposa si hay</field>
      <statement name="STACK">
         <block type="si" id="29" inline="true">
            <value name="condition">
               <block type="TocandoMariposa" id="30" />
            </value>
            <statement name="block">
               <block type="ObservarMariposa" id="31" />
            </statement>
         </block>
      </statement>
   </block>
</xml>`,
   });

});