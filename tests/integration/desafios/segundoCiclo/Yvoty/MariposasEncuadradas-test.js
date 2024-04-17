import { moduloActividad, actividadTest } from '../../../../helpers/actividadTest';

let nombre = "1133";

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
        <xml xmlns="http://www.w3.org/1999/xhtml">
         <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="0" y="0">
            <statement name="program">
               <block type="procedures_callnoreturn" inline="true">
                  <mutation name="Observar mariposas hacia">
                     <arg name="direccion" />
                  </mutation>
                  <value name="ARG0">
                     <block type="ParaLaDerecha"/>
                  </value>
                  <next>
                     <block type="procedures_callnoreturn" inline="true">
                        <mutation name="Observar mariposas hacia">
                           <arg name="direccion" />
                        </mutation>
                        <value name="ARG0">
                           <block type="ParaAbajo"/>
                        </value>
                        <next>
                           <block type="procedures_callnoreturn" inline="true">
                              <mutation name="Observar mariposas hacia">
                                 <arg name="direccion" />
                              </mutation>
                              <value name="ARG0">
                                 <block type="ParaLaIzquierda"/>
                              </value>
                              <next>
                                 <block type="procedures_callnoreturn" inline="true">
                                    <mutation name="Observar mariposas hacia">
                                       <arg name="direccion" />
                                    </mutation>
                                    <value name="ARG0">
                                       <block type="ParaArriba"/>
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
         <block type="procedures_defnoreturn" x="0" y="196">
            <mutation>
               <arg name="direccion" />
            </mutation>
            <field name="NAME">Observar mariposas hacia</field>
            <statement name="STACK">
               <block type="Repetir" inline="true">
                  <value name="count">
                     <block type="math_number">
                        <field name="NUM">6</field>
                     </block>
                  </value>
                  <statement name="block">
                     <block type="MoverA" inline="true">
                        <value name="direccion">
                           <block type="param_get">
                              <field name="VAR">direccion</field>
                           </block>
                        </value>
                        <next>
                           <block type="procedures_callnoreturn">
                              <mutation name="Prender luz si hay" />
                           </block>
                        </next>
                     </block>
                  </statement>
               </block>
            </statement>
         </block>
         <block type="procedures_defnoreturn" x="2" y="363">
            <mutation />
            <field name="NAME">Prender luz si hay</field>
            <statement name="STACK">
               <block type="si" inline="true">
                  <value name="condition">
                    <block type="TocandoMariposa"></block>
                  </value>
                  <statement name="block">
                    <block type="FotografiarMariposa"></block>
                  </statement>
               </block>
            </statement>
         </block>
      </xml>`
   });
});