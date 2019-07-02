import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = "LaFiestaDeDracula";

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
<xml xmlns="http://www.w3.org/1999/xhtml">
   <block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0">
      <statement name="program">
         <block type="procedures_callnoreturn" id="3" inline="true">
            <mutation name="Cambiar foco veces">
               <arg name="veces" />
            </mutation>
            <value name="ARG0">
               <block type="Numero" id="4">
                  <field name="NUM">5</field>
               </block>
            </value>
            <next>
               <block type="SiguienteFoco" id="5">
                  <next>
                     <block type="procedures_callnoreturn" id="6" inline="true">
                        <mutation name="Cambiar foco veces">
                           <arg name="veces" />
                        </mutation>
                        <value name="ARG0">
                           <block type="Numero" id="7">
                              <field name="NUM">8</field>
                           </block>
                        </value>
                        <next>
                           <block type="SiguienteFoco" id="8">
                              <next>
                                 <block type="procedures_callnoreturn" id="9" inline="true">
                                    <mutation name="Cambiar foco veces">
                                       <arg name="veces" />
                                    </mutation>
                                    <value name="ARG0">
                                       <block type="Numero" id="10">
                                          <field name="NUM">12</field>
                                       </block>
                                    </value>
                                    <next>
                                       <block type="EmpezarFiesta" id="11" />
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
      <field name="NAME">Cambiar foco veces</field>
      <statement name="STACK">
         <block type="Repetir" id="13" inline="true">
            <value name="count">
               <block type="param_get" id="14">
                  <field name="VAR">veces</field>
               </block>
            </value>
            <statement name="block">
               <block type="CambiarColor" id="15" />
            </statement>
         </block>
      </statement>
   </block>
</xml>`,
   });

});