import {moduloActividad, actividadTest} from '../../../helpers/actividadTest';

moduloActividad("Toto escritor");

actividadTest("4.I1a", {
  descripcionAdicional: '4.I1a: Se puede resolver',
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <block type=\"al_empezar_a_ejecutar\" id=\"1\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <block type=\"repetir\" id=\"W/=#q%TdW3T9g|?6uW?U\">
          <value name=\"count\">
            <block type=\"math_number\" id=\"H$bkq5pKO5:\`tv}7!DEx\">
              <field name=\"NUM\">7</field>
            </block>
          </value>
          <statement name=\"block\">
            <block type=\"MoverACasillaDerecha\" id=\"6o$rpc;m$\`T.hXx?v:JA\">
              <next>
                <block type=\"EscribirLetraActualEnOtraCuadricula\" id=\"?z6L8/qSbr{QpJk/$VYd\"></block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
});

actividadTest("4.I1b", {
  descripcionAdicional: '4.I1b: Se puede resolver',
  solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <block type=\"al_empezar_a_ejecutar\" id=\"1\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <block type=\"repetir\" id=\"A|*9%tGgGiIX%!v/PT^7\">
          <value name=\"count\">
            <block type=\"math_number\" id=\"A)Np+o{I=:uU[AVqmbte\">
              <field name=\"NUM\">7</field>
            </block>
          </value>
          <statement name=\"block\">
            <block type=\"MoverACasillaDerecha\" id=\"^LGb}9Z#IsyCg;haF05n\">
              <next>
                <block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"qkqTBU1ZmkhL1zbYF\`H\`\">
                  <field name=\"texto\">x</field>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
});

actividadTest("4.I1c", {
  descripcionAdicional: '4.I1c: Se puede resolver',
  solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <block type=\"al_empezar_a_ejecutar\" id=\"1\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <block type=\"repetir\" id=\"=\`!2uFmT)%OBNkt,W=h1\">
          <value name=\"count\">
            <block type=\"math_number\" id=\")t=\`~,E:an(Tus#%m_GZ\">
              <field name=\"NUM\">7</field>
            </block>
          </value>
          <statement name=\"block\">
            <block type=\"MoverACasillaDerecha\" id=\"6^-5XndAQRkx(TLB%YKl\">
              <next>
                <block type=\"EscribirLetraActualEnOtraCuadricula\" id=\":!bE-zPnu1(c=6O6*Ays\">
                  <next>
                    <block type=\"si\" id=\"{oFR|aUP_ZGas]TL0#O-\">
                      <value name=\"condition\">
                        <block type=\"hayVocalRMT\" id=\"(gJIHo6/pol2SElr(hWU\">
                          <field name=\"letra\">m</field>
                        </block>
                      </value>
                      <statement name=\"block\">
                        <block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"!69:l%t)\`lAkWGqoV3/L\">
                          <field name=\"texto\">ICH</field>
                        </block>
                      </statement>
                    </block>
                  </next>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
});

actividadTest("4.I1d", {
  descripcionAdicional: '4.I1d: Se puede resolver',
  solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
    <block type=\"al_empezar_a_ejecutar\" id=\"1\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
      <statement name=\"program\">
        <block type=\"repetir\" id=\"=!2uFmT)%OBNkt,W=h1\">
          <value name=\"count\">
            <block type=\"math_number\" id=\")t=~,E:an(Tus#%m_GZ\">
              <field name=\"NUM\">7</field>
            </block>
          </value>
          <statement name=\"block\">
            <block type=\"MoverACasillaDerecha\" id=\"6^-5XndAQRkx(TLB%YKl\">
              <next>
                <block type=\"EscribirLetraActualEnOtraCuadricula\" id=\":!bE-zPnu1(c=6O6*Ays\">
                  <next>
                    <block type=\"si\" id=\"{oFR|aUP_ZGas]TL0#O-\">
                      <value name=\"condition\">
                        <block type=\"hayVocalRMT\" id=\"(gJIHo6/pol2SElr(hWU\">
                          <field name=\"letra\">a</field>
                        </block>
                      </value>
                      <statement name=\"block\">
                        <block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"!69:l%t)lAkWGqoV3/L\">
                          <field name=\"texto\">PA</field>
                        </block>
                      </statement>
                      <next>
                        <block type=\"si\" id=\"$89%XRW4)H+Vc[L4p$os\">
                          <value name=\"condition\">
                            <block type=\"hayVocalRMT\" id=\"V~0k_.,E:pC-P6s25Dvh\">
                              <field name=\"letra\">e</field>
                            </block>
                          </value>
                          <statement name=\"block\">
                            <block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"v[3jidyfeB#8$Id-b?fC\">
                              <field name=\"texto\">PE</field>
                            </block>
                          </statement>
                          <next>
                            <block type=\"si\" id=\"bPfZSzquLySy{l,zQw0g\">
                              <value name=\"condition\">
                                <block type=\"hayVocalRMT\" id=\"vXOq%jh}nz)+on@wqh.+\">
                                  <field name=\"letra\">i</field>
                                </block>
                              </value>
                              <statement name=\"block\">
                                <block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"vgB@$lggJSwEdwdMi@=B\">
                                  <field name=\"texto\">PI</field>
                                </block>
                              </statement>
                              <next>
                                <block type=\"si\" id=\"ntDqYJC9?k^}J!4C5Mnv\">
                                  <value name=\"condition\">
                                    <block type=\"hayVocalRMT\" id=\"hQi[Z2rk_E3bc9qkSmCu\">
                                      <field name=\"letra\">o</field>
                                    </block>
                                  </value>
                                  <statement name=\"block\">
                                    <block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"PI(L#].UIKcJ$fep:2w$\">
                                      <field name=\"texto\">PO</field>
                                    </block>
                                  </statement>
                                  <next>
                                    <block type=\"si\" id=\".+2dM{!g|p)9na0xUJ6f\">
                                      <value name=\"condition\">
                                        <block type=\"hayVocalRMT\" id=\"fwS,_pJa$33G?CV:3W?~\">
                                          <field name=\"letra\">u</field>
                                        </block>
                                      </value>
                                      <statement name=\"block\">
                                        <block type=\"EscribirTextoDadoEnOtraCuadricula\" id=\"s1KA/O2l@Tnkc#_KL{_Y\">
                                          <field name=\"texto\">PU</field>
                                        </block>
                                      </statement>
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
      </statement>
    </block>
  </xml>`
});
