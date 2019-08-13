import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = "ElMonoCuentaDeNuevo";

moduloActividad(nombre, () => {

   actividadTest(nombre, {
      solucion: `<?xml version="1.0" encoding="UTF-8"?>
<xml xmlns="http://www.w3.org/1999/xhtml">
   <block type="al_empezar_a_ejecutar" id="3" deletable="false" movable="false" editable="false" x="0" y="0">
      <statement name="program">
         <block type="Repetir" id="4" inline="true">
            <value name="count">
               <block type="math_number" id="5">
                  <field name="NUM">4</field>
               </block>
            </value>
            <statement name="block">
               <block type="procedures_callnoreturn" id="6">
                  <mutation name="Contar frutas de columna" />
                  <next>
                     <block type="procedures_callnoreturn" id="7">
                        <mutation name="Volver al inicio" />
                        <next>
                           <block type="SiguienteColumna" id="8" />
                        </next>
                     </block>
                  </next>
               </block>
            </statement>
            <next>
               <block type="procedures_callnoreturn" id="37">
                  <mutation name="Contar frutas de columna" />
               </block>
            </next>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="9" x="280" y="35">
      <mutation />
      <field name="NAME">Volver al inicio</field>
      <statement name="STACK">
         <block type="hasta" id="10" inline="true">
            <value name="condition">
               <block type="EstoySobreElInicio" id="11" />
            </value>
            <statement name="block">
               <block type="MoverACasillaArriba" id="12" />
            </statement>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="13" x="11" y="201">
      <mutation />
      <field name="NAME">Contar frutas de columna</field>
      <statement name="STACK">
         <block type="Repetir" id="14" inline="true">
            <value name="count">
               <block type="LargoColumnaActual" id="15" />
            </value>
            <statement name="block">
               <block type="MoverACasillaAbajo" id="16">
                  <next>
                     <block type="procedures_callnoreturn" id="17">
                        <mutation name="Contar banana si hay" />
                        <next>
                           <block type="procedures_callnoreturn" id="18">
                              <mutation name="Contar manzana si hay" />
                           </block>
                        </next>
                     </block>
                  </next>
               </block>
            </statement>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="19" x="319" y="281">
      <mutation />
      <field name="NAME">Contar manzana si hay</field>
      <statement name="STACK">
         <block type="si" id="20" inline="true">
            <value name="condition">
               <block type="TocandoBanana" id="21" />
            </value>
            <statement name="block">
               <block type="ContarBanana" id="22" />
            </statement>
         </block>
      </statement>
   </block>
   <block type="procedures_defnoreturn" id="23" x="47" y="393">
      <mutation />
      <field name="NAME">Contar banana si hay</field>
      <statement name="STACK">
         <block type="si" id="24" inline="true">
            <value name="condition">
               <block type="TocandoManzana" id="25" />
            </value>
            <statement name="block">
               <block type="ContarManzana" id="26" />
            </statement>
         </block>
      </statement>
   </block>
</xml>`,

   });

});