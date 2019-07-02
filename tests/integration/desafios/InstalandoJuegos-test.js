import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

const nombre = 'InstalandoJuegos';

moduloActividad(nombre, () => {

	actividadTest(nombre, {
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml xmlns="http://www.w3.org/1999/xhtml">
	   <block type="al_empezar_a_ejecutar" id="193" deletable="false" movable="false" editable="false" x="0" y="0">
		  <statement name="program">
			 <block type="Repetir" id="212" inline="true">
				<value name="count">
				   <block type="Numero" id="213">
					  <field name="NUM">3</field>
				   </block>
				</value>
				<statement name="block">
				   <block type="PasarASiguienteComputadora" id="221">
					  <next>
						 <block type="procedures_callnoreturn" id="209">
							<mutation name="Procesar compu" />
						 </block>
					  </next>
				   </block>
				</statement>
			 </block>
		  </statement>
	   </block>
	   <block type="Procedimiento" id="195" x="23" y="215">
		  <mutation />
		  <field name="NAME">Procesar compu</field>
		  <statement name="STACK">
			 <block type="PrenderComputadora" id="229">
				<next>
				   <block type="procedures_callnoreturn" id="233">
					  <mutation name="Ingresar password" />
					  <next>
						 <block type="InstalarJuego" id="241">
							<next>
							   <block type="ApagarComputadora" id="249" />
							</next>
						 </block>
					  </next>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block type="Procedimiento" id="198" x="487" y="218">
		  <mutation />
		  <field name="NAME">Ingresar password</field>
		  <statement name="STACK">
			 <block type="EscribirA" id="257">
				<next>
				   <block type="EscribirB" id="265">
					  <next>
						 <block type="EscribirC" id="273" />
					  </next>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	</xml>`,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'No debe poderse resolver la actividad si no están las tres máquinas instaladas',
		errorEsperado: 'Esta computadora ya fue prendida',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml>
	   <block y="0" x="0" editable="false" movable="false" deletable="false" id="32" type="al_empezar_a_ejecutar">
		  <statement name="program">
			 <block id="35" type="PasarASiguienteComputadora">
				<next>
				   <block inline="true" id="33" type="Repetir">
					  <value name="count">
						 <block id="34" type="Numero">
							<field name="NUM">3</field>
						 </block>
					  </value>
					  <statement name="block">
						 <block id="36" type="procedures_callnoreturn">
							<mutation name="Procesar compu" />
						 </block>
					  </statement>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block y="215" x="23" id="37" type="Procedimiento">
		  <mutation />
		  <field name="NAME">Procesar compu</field>
		  <statement name="STACK">
			 <block id="38" type="PrenderComputadora">
				<next>
				   <block id="39" type="procedures_callnoreturn">
					  <mutation name="Ingresar password" />
					  <next>
						 <block id="40" type="InstalarJuego">
							<next>
							   <block id="41" type="ApagarComputadora" />
							</next>
						 </block>
					  </next>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	   <block y="218" x="487" id="42" type="Procedimiento">
		  <mutation />
		  <field name="NAME">Ingresar password</field>
		  <statement name="STACK">
			 <block id="43" type="EscribirA">
				<next>
				   <block id="44" type="EscribirB">
					  <next>
						 <block id="45" type="EscribirC" />
					  </next>
				   </block>
				</next>
			 </block>
		  </statement>
	   </block>
	</xml>`,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error si se intenta prender una computadora donde no hay',
		errorEsperado: 'No hay una computadora aquí',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
					<xml xmlns="http://www.w3.org/1999/xhtml">
   					<variables />
   					<block type="al_empezar_a_ejecutar" id="hI{t44eHqn15uW[!}1B{" deletable="false" movable="false" editable="false" x="15" y="15">
      					<statement name="program">
         					<block type="PrenderComputadora" id="nugWvB;ltf#4R,Kj!MF+" />
      					</statement>
   					</block>
					</xml>`,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error si se intenta avanzar mas de 3 veces a la siguiente computadora',
		errorEsperado: 'No puedo ir para la derecha',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
					<xml xmlns="http://www.w3.org/1999/xhtml">
   					<variables />
   					<block type="al_empezar_a_ejecutar" id="e9x6)PO4mZu(;D%S5Fws" deletable="false" movable="false" editable="false" x="15" y="15">
      					<statement name="program">
         					<block type="repetir" id="}9;SLseJ$ok_^EJa^Q*L">
            					<value name="count">
               					<block type="math_number" id="hb:M6waC5J7_eBG,Pki6">
                  					<field name="NUM">10</field>
               					</block>
            					</value>
            					<statement name="block">
               					<block type="PasarASiguienteComputadora" id="nsFTpu=3(AA/8}@rBf?h" />
            					</statement>
         					</block>
      					</statement>
   					</block>
					</xml>`,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error si se intenta prender una computadora que ya esta prendida',
		errorEsperado: 'Esta computadora ya fue prendida',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
					<xml xmlns="http://www.w3.org/1999/xhtml">
   					<variables />
   					<block type="al_empezar_a_ejecutar" id="t:SYqPq{bs.BNKDmH.wk" deletable="false" movable="false" editable="false" x="15" y="15">
      					<statement name="program">
         					<block type="PasarASiguienteComputadora" id="e,)4hv.:V0gkgcpcT=@7">
            					<next>
               					<block type="PrenderComputadora" id="5;*S9+]*@XrvkZ};%99]">
                  					<next>
                     					<block type="PrenderComputadora" id="5;*S9+]*@XrvkZ};%92]"/>
                  					</next>
               					</block>
            					</next>
         					</block>
      					</statement>
   					</block>
					</xml>`,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error si se intenta apagar una computadora que ya esta apagada',
		errorEsperado: 'Esta computadora ya está apagada',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
					<xml xmlns="http://www.w3.org/1999/xhtml">
   					<variables />
   					<block type="al_empezar_a_ejecutar" id="so@Q*BAb]=G_!6k##0])" deletable="false" movable="false" editable="false" x="15" y="15">
      					<statement name="program">
         					<block type="PasarASiguienteComputadora" id="4QF!}.61@^Vhg1IeE~5y">
            					<next>
               					<block type="ApagarComputadora" id="iR{[:q[8r/@*jg9/=//^" />
            					</next>
         					</block>
     						</statement>
   					</block>
					</xml>`,
	});

	actividadTest(nombre, {
		descripcionAdicional: 'Da error si se intenta apagar una computadora que ya esta apagada luego de haber instalado un juego',
		errorEsperado: 'Esta computadora ya está apagada',
		solucion: `<?xml version="1.0" encoding="UTF-8"?>
	<xml xmlns="http://www.w3.org/1999/xhtml">
   <variables />
   <block type="al_empezar_a_ejecutar" id="t:SYqPq{bs.BNKDmH.wk" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
         <block type="PasarASiguienteComputadora" id="e,)4hv.:V0gkgcpcT=@7">
            <next>
               <block type="PrenderComputadora" id="5;*S9+]*@XrvkZ};%99]">
                  <next>
                     <block type="EscribirA" id="01R6!qo_|g@ZO!y:sp;I">
                        <next>
                           <block type="EscribirB" id="S6Lo+~]f3js1:ORx1l0P">
                              <next>
                                 <block type="EscribirC" id="IvsDp]9(QH{u:28}Fo/J">
                                    <next>
                                       <block type="InstalarJuego" id="%z2U+O_q.M_+a/C.P%e}">
                                          <next>
                                             <block type="ApagarComputadora" id="d@aya8s:mow9pTAMA=mA">
                                                <next>
                                                   <block type="ApagarComputadora" id="0!jy:__2hKNhTSaLE5K(" />
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
            </next>
         </block>
      </statement>
   </block>
</xml>`,
	});


	actividadTest(nombre, {
		descripcionAdicional: 'Da error si se intenta prender una computadora en la cual ya se termino de instalar el juego de forma satisfactoria',
		errorEsperado: 'Esta computadora ya fue prendida',
		solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
  <variables></variables>
  <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
    <statement name="program">
      <block type="PasarASiguienteComputadora">
        <next>
          <block type="PrenderComputadora">
            <next>
              <block type="EscribirA">
                <next>
                  <block type="EscribirB">
                    <next>
                      <block type="EscribirC">
                        <next>
                          <block type="InstalarJuego">
                            <next>
                              <block type="ApagarComputadora">
                                <next>
                                  <block type="PrenderComputadora"></block>
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
        </next>
      </block>
    </statement>
  </block>
</xml>`,
	});

});