import { moduloActividad, actividadTest } from '../../helpers/actividadTest';

moduloActividad('DibujandoAlCuadrado', () => {

  actividadTest('DibujandoAlCuadrado', {
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" id="18" deletable="false" movable="false" editable="false" x="0" y="0">
      <statement name="program">
        <block type="procedures_callnoreturn" id="21">
          <mutation name="Dibujar cuadrado de 100"></mutation>
        </block>
      </statement>
    </block>
    <block type="procedures_defnoreturn" id="24" x="20" y="180">
      <mutation></mutation>
      <field name="NAME">Dibujar cuadrado de 100</field>
      <statement name="STACK">
        <block type="repetir" id="25" inline="true">
          <value name="count">
            <block type="math_number" id="26">
              <field name="NUM">4</field>
            </block>
          </value>
          <statement name="block">
            <block type="DibujarLado" id="27" inline="true">
              <value name="longitud">
                <block type="math_number" id="28">
                  <field name="NUM">100</field>
                </block>
              </value>
              <next>
                <block type="GirarGrados" id="29" inline="true">
                  <value name="grados">
                    <block type="math_number" id="30">
                      <field name="NUM">90</field>
                    </block>
                  </value>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
  </xml>`
  });

});

moduloActividad('DibujandoRayuelaRobotica', () => {

  actividadTest('DibujandoRayuelaRobotica', {
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0">
        <statement name="program">
          <block type="repetir" id="38" inline="true">
            <value name="count">
              <block type="math_number" id="39">
                <field name="NUM">5</field>
              </block>
            </value>
            <statement name="block">
              <block type="procedures_callnoreturn" id="3">
                <mutation name="Dibujar cuadrado de 50"></mutation>
                <next>
                  <block type="DibujarLado" id="28" inline="true">
                    <value name="longitud">
                      <block type="math_number" id="29">
                        <field name="NUM">50</field>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </statement>
      </block>
      <block type="procedures_defnoreturn" id="4" x="20" y="180">
        <mutation></mutation>
        <field name="NAME">Dibujar cuadrado de 50</field>
        <statement name="STACK">
          <block type="repetir" id="5" inline="true">
            <value name="count">
              <block type="math_number" id="6">
                <field name="NUM">4</field>
              </block>
            </value>
            <statement name="block">
              <block type="DibujarLado" id="7" inline="true">
                <value name="longitud">
                  <block type="math_number" id="8">
                    <field name="NUM">50</field>
                  </block>
                </value>
                <next>
                  <block type="GirarGrados" id="9" inline="true">
                    <value name="grados">
                      <block type="math_number" id="10">
                        <field name="NUM">90</field>
                      </block>
                    </value>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </statement>
      </block>
    </xml>`
  });

  actividadTest('DibujandoRayuelaRobotica', {
    descripcionAdicional: 'La habilidad saltar hacia adelante debe funcionar.',
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="YrCGyJP5*Nqd;vN*,P)!" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="repetir" id="1o`5(i4f+*Q.?#Y~aUK("><value name="count"><block type="math_number" id="j:9!5DK!5RRxnK7k{a?n"><field name="NUM">4</field></block></value><statement name="block"><block type="procedures_callnoreturn" id=":{LYG1YcZ5RqI*7hs{)G"><mutation name="hacer cuadradito"></mutation><next><block type="SaltarHaciaAdelante" id="3sU%gT0u+|y0/Bx@;~qp"><value name="longitud"><block type="math_number" id="rcMhOlOZ|YW!+4%n?=KG"><field name="NUM">50</field></block></value></block></next></block></statement><next><block type="procedures_callnoreturn" id="uL,gl|k}tZx/~bfK[Cq;"><mutation name="hacer cuadradito"></mutation></block></next></block></statement></block><block type="procedures_defnoreturn" id=":O!;06MUE)%.c%fD.SGV" x="356" y="42"><field name="NAME">hacer cuadradito</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="repetir" id="D]cQ-tdd_4Nf0IJ$supe"><value name="count"><block type="math_number" id="Acn5=Mj]K)HI#!`TqJY)"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id=";@x:+F+|OP$;dp:yWbH_"><value name="longitud"><block type="math_number" id=".OhWri_#|^gKP?B)L~c."><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="?_m:c$@TST(=/M[Qxtal"><value name="grados"><block type="math_number" id="v{%_Ubp%#fz6B3-N%3~q"><field name="NUM">90</field></block></value></block></next></block></statement></block></statement></block></xml>',
    resuelveDesafio: true
  });

});

moduloActividad('DibujandoCortoPorLaDiagonal', () => {

  actividadTest('DibujandoCortoPorLaDiagonal', {
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="3" inline="true"><value name="count"><block type="math_number" id="4"><field name="NUM">5</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="5"><mutation name="Dibujar cuadrado de 50"></mutation><next><block type="DibujarLado" id="6" inline="true"><value name="longitud"><block type="math_number" id="7"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="50" inline="true"><value name="grados"><block type="math_number" id="51"><field name="NUM">90</field></block></value><next><block type="DibujarLado" id="28" inline="true"><value name="longitud"><block type="math_number" id="29"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="58" inline="true"><value name="grados"><block type="math_number" id="59"><field name="NUM">270</field></block></value></block></next></block></next></block></next></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="8" x="348" y="-9"><mutation></mutation><field name="NAME">Dibujar cuadrado de 50</field><statement name="STACK"><block type="repetir" id="9" inline="true"><value name="count"><block type="math_number" id="10"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id="11" inline="true"><value name="longitud"><block type="math_number" id="12"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="13" inline="true"><value name="grados"><block type="math_number" id="14"><field name="NUM">90</field></block></value></block></next></block></statement></block></statement></block></xml>'
  });

  actividadTest('DibujandoCortoPorLaDiagonal', {
    descripcionAdicional: 'La habilidad saltar hacia adelante debe funcionar.',
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="z.*Gl,c~JX@!zbN0PgPK" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="repetir" id="HIeFx)3BIcu|LxnpG9$8"><value name="count"><block type="math_number" id="UJL2_3{BqJ1`c/6m},5O"><field name="NUM">5</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="uAMN`e?Yux._J/=IN/3i"><mutation name="Dibujar cuadradito"></mutation><next><block type="procedures_callnoreturn" id="hr-D112DJ[rxs9;BNXp("><mutation name="Avanzar a siguiente figura"></mutation></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="UbDHz2K}^Ea6cca;A3JA" x="298" y="21"><field name="NAME">Dibujar cuadradito</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="repetir" id="!sA|i=9_cH8P3BHS~flq"><value name="count"><block type="math_number" id="h),2WI+`/LTZp!SQ8)#2"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id="~#f`v_8m34edb[HID|V5"><value name="longitud"><block type="math_number" id="/meepkK)}P/%sGAd2LYf"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="J=X*)0APaOR?wq;8tfdb"><value name="grados"><block type="math_number" id="dMDJS[4Rs#;A]/@by3av"><field name="NUM">90</field></block></value></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="#5Pjg,9mF8EzSFtQUSDT" x="286" y="192"><field name="NAME">Avanzar a siguiente figura</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="SaltarHaciaAdelante" id="Juc)P^1V7@hV,4Sq@sNm"><value name="longitud"><block type="math_number" id="?%DMonAJE.LvX@4FrV(4"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="O7%i-@Yu32efb3mN_2LS"><value name="grados"><block type="math_number" id=":i.p_r-sN-}6X}w{=l3T"><field name="NUM">90</field></block></value><next><block type="SaltarHaciaAdelante" id="D-@@rE,]^0D$8D?)lSdC"><value name="longitud"><block type="math_number" id="shwwhQd29I52nrG#FPkG"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="(nOA@fC~{_7exTwYOAVV"><value name="grados"><block type="math_number" id="[PVZynw8_/!WF~Fps^oE"><field name="NUM">270</field></block></value></block></next></block></next></block></next></block></statement></block></xml>',
    resuelveDesafio: true
  });

});

moduloActividad('DibujandoMamushkaCuadrada', () => {

  actividadTest('DibujandoMamushkaCuadrada', {
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="5" inline="true"><mutation name="Dibujar cuadrado de 50"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="30"><field name="NUM">50</field></block></value><next><block type="procedures_callnoreturn" id="36" inline="true"><mutation name="Dibujar cuadrado de 50"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="33"><field name="NUM">100</field></block></value><next><block type="procedures_callnoreturn" id="39" inline="true"><mutation name="Dibujar cuadrado de 50"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="43"><field name="NUM">150</field></block></value><next><block type="procedures_callnoreturn" id="46" inline="true"><mutation name="Dibujar cuadrado de 50"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="48"><field name="NUM">200</field></block></value></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="14" x="4" y="290"><mutation><arg name="largo lado"></arg></mutation><field name="NAME">Dibujar cuadrado de 50</field><statement name="STACK"><block type="repetir" id="15" inline="true"><value name="count"><block type="math_number" id="16"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id="17" inline="true"><value name="longitud"><block type="param_get" id="27"><field name="VAR">largo lado</field></block></value><next><block type="GirarGrados" id="19" inline="true"><value name="grados"><block type="math_number" id="20"><field name="NUM">90</field></block></value></block></next></block></statement></block></statement></block></xml>'
  });

});

moduloActividad('DibujandoEscaleraCuadrada', () => {

  actividadTest('DibujandoEscaleraCuadrada', {
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="20" inline="true"><mutation name="Dibujar cuadrado"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="21"><field name="NUM">100</field></block></value><next><block type="procedures_callnoreturn" id="72"><mutation name="Ir Siguiente grande"></mutation><next><block type="repetir" id="104" inline="true"><value name="count"><block type="math_number" id="105"><field name="NUM">4</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="22" inline="true"><mutation name="Dibujar cuadrado"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="23"><field name="NUM">50</field></block></value><next><block type="DibujarLado" id="86" inline="true"><value name="longitud"><block type="math_number" id="87"><field name="NUM">50</field></block></value></block></next></block></statement></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="47" x="413" y="200"><mutation></mutation><field name="NAME">Ir Siguiente grande</field><statement name="STACK"><block type="DibujarLado" id="56" inline="true"><value name="longitud"><block type="math_number" id="57"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="39" inline="true"><value name="grados"><block type="math_number" id="40"><field name="NUM">90</field></block></value><next><block type="DibujarLado" id="62" inline="true"><value name="longitud"><block type="math_number" id="63"><field name="NUM">100</field></block></value></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="28" x="40" y="301"><mutation><arg name="largo lado"></arg></mutation><field name="NAME">Dibujar cuadrado</field><statement name="STACK"><block type="repetir" id="29" inline="true"><value name="count"><block type="math_number" id="30"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id="31" inline="true"><value name="longitud"><block type="param_get" id="32"><field name="VAR">largo lado</field></block></value><next><block type="GirarGrados" id="33" inline="true"><value name="grados"><block type="math_number" id="34"><field name="NUM">90</field></block></value></block></next></block></statement></block></statement></block></xml>'
  });


  actividadTest('DibujandoEscaleraCuadrada', {
    descripcionAdicional: 'La habilidad saltar hacia adelante debe funcionar',
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="+9CHb~cPzv@du|%Z[DO8" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="procedures_callnoreturn" id="^wP*$fD4n6`dJ(9QNT@$"><mutation name="Dibujar cuadrado"></mutation><next><block type="repetir" id="_KP~-~QM0+x3+3v{%~yX"><value name="count"><block type="math_number" id="c,_L04QILWr(qi;4CK?}"><field name="NUM">4</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="F?~AF=y*^8wEi%1]CxKK"><mutation name="Dibujar Cuadradito"></mutation><next><block type="procedures_callnoreturn" id="0${3C{h@:Cgl?f60/0{c"><mutation name="Avanzar a siguiente cuadradito"></mutation></block></next></block></statement></block></next></block></statement></block><block type="procedures_defnoreturn" id="$H^lKeO))zlt[KD`FBaw" x="408" y="25"><field name="NAME">Dibujar cuadrado</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="repetir" id="PZia#3u|ecS__Jra%:_;"><value name="count"><block type="math_number" id="/[:QP5HjaQn;7ZrVc5P{"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id=":[oeE/75P6Snfgz?M^x="><value name="longitud"><block type="math_number" id="d{*,3tjYpg{~}b$b@Dgc"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="xjoV?KI{Cz~7MaP8Y5df"><value name="grados"><block type="math_number" id="yog.;,ww_?xeU_,6ech9"><field name="NUM">90</field></block></value></block></next></block></statement><next><block type="SaltarHaciaAdelante" id="IP%`$Y=4uD~7?3JxH%YE"><value name="longitud"><block type="math_number" id="gH/$j~+Rk:xi3sll]2yw"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="^t:d6o5n#H*x~r2x^ffB"><value name="grados"><block type="math_number" id="B8aa1KfF85=kJ/7)r9OU"><field name="NUM">90</field></block></value><next><block type="SaltarHaciaAdelante" id="zrvkVQz/:w_+gy(kYF9A"><value name="longitud"><block type="math_number" id="!n?+=u2b*+#9)Jz.K$mE"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="?IX+_oTh[tZ{7:D2)uh)"><value name="grados"><block type="math_number" id=":`v`$-Ol(jy@t[WQbdbw"><field name="NUM">270</field></block></value></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="|pymycmDH.5l^@u!WHV~" x="20" y="198"><field name="NAME">Avanzar a siguiente cuadradito</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="GirarGrados" id="!{c*dq%mopnh6vs;hvMs"><value name="grados"><block type="math_number" id="Bk*dIkD|SDG1M/HWDycv"><field name="NUM">90</field></block></value><next><block type="SaltarHaciaAdelante" id="8onuQ^?{INKZW=(%n(!h"><value name="longitud"><block type="math_number" id="/EQ?xl/l;lT_5BCJl2EK"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="P7!-gDiMm{%34)qJDsv~"><value name="grados"><block type="math_number" id="?V:!Q!Q-f6l~5d_@bUnK"><field name="NUM">270</field></block></value></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="o^1jg67e~h??bcPK5v@5" x="410" y="360"><field name="NAME">Dibujar Cuadradito</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="repetir" id="+V;hsu]FT:69FwV_KO4l"><value name="count"><block type="math_number" id="fe^C/=TGp;2th=_ZCgAu"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id="Pu:-FKB9!n,tvm?SG$fz"><value name="longitud"><block type="math_number" id="],iJNu(AGL7G!i[GDuq1"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="y=N`#raR80(TKU/lHUcr"><value name="grados"><block type="math_number" id="f}A#}M:HYp:.1}B6(5nJ"><field name="NUM">90</field></block></value></block></next></block></statement></block></statement></block></xml>',
    resuelveDesafio: true
  });

  actividadTest('DibujandoEscaleraCuadrada', {
    descripcionAdicional: 'Solución alternativa debe solucionar el desafío',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables>
      <variable type="">x</variable>
      <variable type="">largo del lado</variable>
    </variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="procedures_callnoreturn">
          <mutation name="dibujar un cuadrado">
            <arg name="largo del lado"></arg>
          </mutation>
          <value name="ARG0">
            <block type="Numero">
              <field name="NUM">100</field>
            </block>
          </value>
          <next>
            <block type="procedures_callnoreturn">
              <mutation name="acomodar alien en el cuadrado">
                <arg name="largo del lado"></arg>
              </mutation>
              <value name="ARG0">
                <block type="Numero">
                  <field name="NUM">100</field>
                </block>
              </value>
              <next>
                <block type="DibujarLado">
                  <value name="longitud">
                    <block type="math_number">
                      <field name="NUM">50</field>
                    </block>
                  </value>
                  <next>
                    <block type="repetir">
                      <value name="count">
                        <block type="math_number">
                          <field name="NUM">4</field>
                        </block>
                      </value>
                      <statement name="block">
                        <block type="procedures_callnoreturn">
                          <mutation name="dibujar un cuadrado">
                            <arg name="largo del lado"></arg>
                          </mutation>
                          <value name="ARG0">
                            <block type="Numero">
                              <field name="NUM">50</field>
                            </block>
                          </value>
                          <next>
                            <block type="procedures_callnoreturn">
                              <mutation name="acomodar alien en el cuadrado">
                                <arg name="largo del lado"></arg>
                              </mutation>
                              <value name="ARG0">
                                <block type="Numero">
                                  <field name="NUM">50</field>
                                </block>
                              </value>
                            </block>
                          </next>
                        </block>
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
    <block type="procedures_defnoreturn" x="303" y="168">
      <mutation>
        <arg name="largo del lado"></arg>
      </mutation>
      <field name="NAME">dibujar un cuadrado</field>
      <comment pinned="false" h="80" w="160">Describe esta función...</comment>
      <statement name="STACK">
        <block type="repetir">
          <value name="count">
            <block type="math_number">
              <field name="NUM">4</field>
            </block>
          </value>
          <statement name="block">
            <block type="DibujarLado">
              <value name="longitud">
                <block type="variables_get">
                  <field name="VAR" variabletype="">largo del lado</field>
                </block>
              </value>
              <next>
                <block type="GirarGrados">
                  <value name="grados">
                    <block type="math_number">
                      <field name="NUM">90</field>
                    </block>
                  </value>
                </block>
              </next>
            </block>
          </statement>
        </block>
      </statement>
    </block>
    <block type="procedures_defnoreturn" x="24" y="379">
      <mutation>
        <arg name="largo del lado"></arg>
      </mutation>
      <field name="NAME">acomodar alien en el cuadrado</field>
      <comment pinned="false" h="80" w="160">Describe esta función...</comment>
      <statement name="STACK">
        <block type="GirarGrados">
          <value name="grados">
            <block type="math_number">
              <field name="NUM">90</field>
            </block>
          </value>
          <next>
            <block type="DibujarLado">
              <value name="longitud">
                <block type="variables_get">
                  <field name="VAR" variabletype="">largo del lado</field>
                </block>
              </value>
              <next>
                <block type="GirarGrados">
                  <value name="grados">
                    <block type="math_number">
                      <field name="NUM">270</field>
                    </block>
                  </value>
                </block>
              </next>
            </block>
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
    resuelveDesafio: true
  });

  actividadTest('DibujandoEscaleraCuadrada', {
    descripcionAdicional: 'Otra solución alternativa debe solucionar el desafío',
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="al_empezar_a_ejecutar" id="ic:eis)a8D|w@Sf`lItT" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="procedures_callnoreturn" id="YecAr$BID!?=oq1gtJDX"><mutation name="dibujar cuadrado grande"></mutation><next><block type="GirarGrados" id="fIgjq}88]:~+{i`]!uQw"><value name="grados"><block type="math_number" id="yzUI+]}sX3kPa4d8kY5a"><field name="NUM">90</field></block></value><next><block type="DibujarLado" id="p3C?!(V%2`Mcqh7-/E}8"><value name="longitud"><block type="math_number" id="u{}fqz^jVcSeoCeVFpkD"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="re4$kz|Hj4w,06e-ONFy"><value name="grados"><block type="math_number" id="q12_lMX`*8jT2(g^VF6I"><field name="NUM">-90</field></block></value><next><block type="DibujarLado" id="D!oo-=kj-a(094lQgOa3"><value name="longitud"><block type="math_number" id="A|/xIpY{KAYAyA@~UtIM"><field name="NUM">50</field></block></value><next><block type="repetir" id="`SdXWs{P%d9hWiXQ[C7i"><value name="count"><block type="math_number" id="(7vDpZNtgN3/w;}~Nv^T"><field name="NUM">4</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="EB$btXbhVra6{[klQ}Vv"><mutation name="dibujar cuadrado pequeo"></mutation><next><block type="GirarGrados" id=";kSB}22$`w|Zcm[y9pX!"><value name="grados"><block type="math_number" id="!xMH)ANUNVGkg8v[GM_4"><field name="NUM">90</field></block></value><next><block type="DibujarLado" id="iEAI.IuDBav?@`*H-lSm"><value name="longitud"><block type="math_number" id="VE%S/eLrtoBdX^0WhTRO"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="$]Ax#=ckd6[A3ask_d=j"><value name="grados"><block type="math_number" id="lgB_$n8t12=z5BD.|CX6"><field name="NUM">-90</field></block></value></block></next></block></next></block></next></block></statement></block></next></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="?G7ZD/00o7OnRlg`dqks" x="325" y="106"><field name="NAME">dibujar cuadrado grande</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="repetir" id="#NN-!of[QJy:|/xCB^Nr"><value name="count"><block type="math_number" id="n@c;T_97sim3gx9-qJNX"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id="(o%OWkva8g9[#}BPO3l5"><value name="longitud"><block type="math_number" id=")ZVhG5q}xKu]$e:6$lV%"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="+w3XC5Tk$[Tvi0ns:$HF"><value name="grados"><block type="math_number" id="D6B6R}wh])h])~HNxJ)o"><field name="NUM">90</field></block></value></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="[$ek:t9E/AAOk?tA=N$O" x="326" y="250"><field name="NAME">dibujar cuadrado pequeo</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="repetir" id="cG;)F)zOP32GKFOOmxTK"><value name="count"><block type="math_number" id="|D)0K7hFzFkr5^ym2Y@0"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id="np:yXxn?Ais.O)Ai5S=}"><value name="longitud"><block type="math_number" id="{RQZA;+dgaZD^b1y$ygR"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id=")l`wC~OiT}cbnBl~ZyPB"><value name="grados"><block type="math_number" id="7JP415vKB.Am.)w9!mXo"><field name="NUM">90</field></block></value></block></next></block></statement></block></statement></block></xml>'
  });

});

moduloActividad('DibujandoHexagono', () => {

  actividadTest('DibujandoHexagono', {
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="29" inline="true"><value name="count"><block type="math_number" id="30"><field name="NUM">6</field></block></value><statement name="block"><block type="DibujarLado" id="31" inline="true"><value name="longitud"><block type="math_number" id="128"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="33" inline="true"><value name="grados"><block type="math_number" id="34"><field name="NUM">60</field></block></value></block></next></block></statement></block></statement></block></xml>'
  });

});

moduloActividad('DibujandoPiramideInvertida', () => {

  actividadTest('DibujandoPiramideInvertida', {
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="29" inline="true"><value name="count"><block type="math_number" id="30"><field name="NUM">3</field></block></value><statement name="block"><block type="DibujarLado" id="31" inline="true"><value name="longitud"><block type="math_number" id="128"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="33" inline="true"><value name="grados"><block type="math_number" id="34"><field name="NUM">120</field></block></value></block></next></block></statement></block></statement></block></xml>'
  });

});

moduloActividad('DibujandoFigurasDentroDeFiguras', () => {

  actividadTest('DibujandoFigurasDentroDeFiguras', {
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="177" inline="true"><mutation name="Dibujar poligono de lados"><arg name="cantidad"></arg></mutation><value name="ARG0"><block type="math_number" id="179"><field name="NUM">3</field></block></value><next><block type="procedures_callnoreturn" id="191" inline="true"><mutation name="Dibujar poligono de lados"><arg name="cantidad"></arg></mutation><value name="ARG0"><block type="math_number" id="196"><field name="NUM">4</field></block></value><next><block type="procedures_callnoreturn" id="194" inline="true"><mutation name="Dibujar poligono de lados"><arg name="cantidad"></arg></mutation><value name="ARG0"><block type="math_number" id="198"><field name="NUM">5</field></block></value></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="130" x="47" y="191"><mutation><arg name="cantidad"></arg></mutation><field name="NAME">Dibujar poligono de lados</field><statement name="STACK"><block type="repetir" id="29" inline="true"><value name="count"><block type="param_get" id="149"><field name="VAR">cantidad</field></block></value><statement name="block"><block type="DibujarLado" id="31" inline="true"><value name="longitud"><block type="math_number" id="128"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="33" inline="true"><value name="grados"><block type="math_arithmetic" id="139" inline="true"><field name="OP">DIVIDE</field><value name="A"><block type="math_number" id="34"><field name="NUM">360</field></block></value><value name="B"><block type="param_get" id="137"><field name="VAR">cantidad</field></block></value></block></value></block></next></block></statement></block></statement></block></xml>'
  });

  actividadTest('DibujandoFigurasDentroDeFiguras', {
    descripcionAdicional: 'Al tener un bloque con un id que contenga el caracter $, deberia funcionar correctamente, previo a la resolucion del issue no andaba',
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="!kYgjw}3BbbVT];Yv4b," deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="procedures_callnoreturn" id="~z.SKruYLd7ntE*e#(_$"><mutation name="hacer algo"><arg name="x"></arg><arg name="y"></arg></mutation><value name="ARG0"><block type="Numero" id="dTBs`2W#STpQ@+,/A|fJ"><field name="NUM">5</field></block></value><value name="ARG1"><block type="Numero" id="EqjKl{!]VKN(NDE-AB{y"><field name="NUM">100</field></block></value></block></statement></block><block type="procedures_defnoreturn" id="H~9q2sAlzr}D${9*Gf?$" x="178" y="222"><mutation><arg name="x"></arg><arg name="y"></arg></mutation><field name="NAME">hacer algo</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="RepetirVacio" id="IvT|[DBp5hGl69d?MM+e"><value name="count"><block type="variables_get" id="D`z2HeUFp,Lui3K(fp(m"><field name="VAR">x</field></block></value><statement name="block"><block type="DibujarLado" id="BIlSM-5bS2q:-5GMflNm"><value name="longitud"><block type="variables_get" id="j}q):ve!%T4veFV6kNU("><field name="VAR">y</field></block></value><next><block type="GirarGrados" id="t;Wxq8lrT:0Nk;J1ArOB"><value name="grados"><block type="OpAritmetica" id="+01IVklSNUtmhe74QS!R"><field name="OP">DIVIDE</field><value name="A"><block type="math_number" id="j,LtYNSPYNJy;?$2(BN5"><field name="NUM">360</field></block></value><value name="B"><block type="variables_get" id="XDuk8LG4[qOtcx|(vCc4"><field name="VAR">x</field></block></value></block></value></block></next></block></statement></block></statement></block><block type="math_number" id="?daCSErBq`I+6(.IbLZb" disabled="true" x="420" y="543"><field name="NUM">100</field></block></xml>',
    resuelveDesafio: false
  });

  actividadTest('DibujandoFigurasDentroDeFiguras', {
    descripcionAdicional: 'Al tener un bloque con un id que contenga el caracter $, deberia funcionar correctamente, previo a la resolucion del issue andaba',
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="ov:a}`,YO)1u@{;$U/*D" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="procedures_callnoreturn" id="Pb4ovzuf:+KRB*cG/@U5"><mutation name="hacer algo"><arg name="x"></arg><arg name="y"></arg></mutation><value name="ARG0"><block type="math_number" id="!vWiv@U1{9J^W9NN.cAa"><field name="NUM">10</field></block></value><value name="ARG1"><block type="math_number" id="(3ecL:P)78xcO!mYo]NQ"><field name="NUM">10</field></block></value></block></statement></block><block type="procedures_defnoreturn" id="3-Wztz*X,htVX|P=0iWH" x="117" y="115"><mutation><arg name="x"></arg><arg name="y"></arg></mutation><field name="NAME">hacer algo</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="repetir" id="Yh_Dt+iV%(fQ2+,.I[D/"><value name="count"><block type="variables_get" id="$EHWhV+/2{W%4@piBs)a"><field name="VAR">y</field></block></value><statement name="block"><block type="DibujarLado" id="1rv~K7(]XaZxH,NqUR7i"><value name="longitud"><block type="math_number" id="{U:Czfjj@s]0DX:rqfKw"><field name="NUM">100</field></block></value><next><block type="DibujarLado" id="aew17*cc0_]{%.QjYTf|"><value name="longitud"><block type="OpAritmetica" id="I|2.;o#9!^WpuAA^E*||"><field name="OP">DIVIDE</field><value name="A"><block type="math_number" id="5T[o1Wm(UGWyi(21-jEU"><field name="NUM">100</field></block></value><value name="B"><block type="variables_get" id="a{)fh?b(n+WA/J=$,d^{"><field name="VAR">x</field></block></value></block></value></block></next></block></statement></block></statement></block><block type="variables_get" id="KDJ5@i|7z@9lfknqAft%" disabled="true" x="272" y="503"><field name="VAR">x</field></block></xml>',
    resuelveDesafio: false
  });

});

moduloActividad('DibujandoLaCuevaDeEstalagtitas', () => {

  actividadTest('DibujandoLaCuevaDeEstalagtitas', {
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="352" inline="true"><mutation name="Dibujar poligono"><arg name="cantidad"></arg><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="366"><field name="NUM">4</field></block></value><value name="ARG1"><block type="math_number" id="368"><field name="NUM">200</field></block></value><next><block type="procedures_callnoreturn" id="343" inline="true"><mutation name="Dibujar poligono"><arg name="cantidad"></arg><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="354"><field name="NUM">3</field></block></value><value name="ARG1"><block type="math_number" id="356"><field name="NUM">40</field></block></value><next><block type="DibujarLado" id="317" inline="true"><value name="longitud"><block type="math_number" id="318"><field name="NUM">40</field></block></value><next><block type="procedures_callnoreturn" id="346" inline="true"><mutation name="Dibujar poligono"><arg name="cantidad"></arg><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="358"><field name="NUM">3</field></block></value><value name="ARG1"><block type="math_number" id="360"><field name="NUM">60</field></block></value><next><block type="DibujarLado" id="333" inline="true"><value name="longitud"><block type="math_number" id="334"><field name="NUM">60</field></block></value><next><block type="procedures_callnoreturn" id="349" inline="true"><mutation name="Dibujar poligono"><arg name="cantidad"></arg><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="362"><field name="NUM">3</field></block></value><value name="ARG1"><block type="math_number" id="364"><field name="NUM">100</field></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="130" x="59" y="315"><mutation><arg name="cantidad"></arg><arg name="largo lado"></arg></mutation><field name="NAME">Dibujar poligono</field><statement name="STACK"><block type="repetir" id="29" inline="true"><value name="count"><block type="param_get" id="149"><field name="VAR">cantidad</field></block></value><statement name="block"><block type="DibujarLado" id="31" inline="true"><value name="longitud"><block type="param_get" id="210"><field name="VAR">largo lado</field></block></value><next><block type="GirarGrados" id="33" inline="true"><value name="grados"><block type="math_arithmetic" id="139" inline="true"><field name="OP">DIVIDE</field><value name="A"><block type="math_number" id="34"><field name="NUM">360</field></block></value><value name="B"><block type="param_get" id="137"><field name="VAR">cantidad</field></block></value></block></value></block></next></block></statement></block></statement></block></xml>'
  });


  actividadTest('DibujandoLaCuevaDeEstalagtitas', {
    descripcionAdicional: 'La habilidad saltar hacia adelante debe funcionar.',
    solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><variables><variable type="" id="l]e|T{U$pC%5S@a|9H`4">x</variable><variable type="" id="yd2]Tx-`eIbJbB/NJu8v">cantidad de lados</variable><variable type="" id="kJIbvmiGNlG*Y.#3c)jX">longitud</variable></variables><block type="al_empezar_a_ejecutar" id="){hzjyxad9}}A~(wiZvd" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="procedures_callnoreturn" id="SwKK|!wY%-1h}cmzqfFC"><mutation name="Dibujar  figura"><arg name="cantidad de lados"></arg><arg name="longitud"></arg></mutation><value name="ARG0"><block type="Numero" id="/c.]LuN=Q2Q$_J`C::6-"><field name="NUM">4</field></block></value><value name="ARG1"><block type="Numero" id="a8cJXc~:xN||r$y`U_Xt"><field name="NUM">200</field></block></value><next><block type="procedures_callnoreturn" id="s6V3)CTii0#Z+phW8WK."><mutation name="Dibujar  figura"><arg name="cantidad de lados"></arg><arg name="longitud"></arg></mutation><value name="ARG0"><block type="Numero" id="hL8z{,@s@^G*h#wg;(O1"><field name="NUM">3</field></block></value><value name="ARG1"><block type="Numero" id="e2nQ5Re-#Gc_}s_3969x"><field name="NUM">40</field></block></value><next><block type="SaltarHaciaAdelante" id="6.7kc[7/stXq2jDqf/pD"><value name="longitud"><block type="math_number" id="olkq!R!#!uvfJbGFfotR"><field name="NUM">40</field></block></value><next><block type="procedures_callnoreturn" id="kdh;V^.c|XC,6PpS[.ub"><mutation name="Dibujar  figura"><arg name="cantidad de lados"></arg><arg name="longitud"></arg></mutation><value name="ARG0"><block type="Numero" id="OMsh(w04-|9^D=Ep[;Uo"><field name="NUM">3</field></block></value><value name="ARG1"><block type="Numero" id="^,GjP-U2G9}c_8e}HUy8"><field name="NUM">60</field></block></value><next><block type="SaltarHaciaAdelante" id="1mIzs%;$ArS8-2zRHbuI"><value name="longitud"><block type="math_number" id="Z$HXjRHS_;ksF3kc1`Z#"><field name="NUM">60</field></block></value><next><block type="procedures_callnoreturn" id="+WTH{f;@uSvi|AD$*[j0"><mutation name="Dibujar  figura"><arg name="cantidad de lados"></arg><arg name="longitud"></arg></mutation><value name="ARG0"><block type="Numero" id="p9Lvf-s[,`(gsuyP#+lU"><field name="NUM">3</field></block></value><value name="ARG1"><block type="Numero" id="oD/]cLZ#A2I:`6/N0d10"><field name="NUM">100</field></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="}/y|d}fM}@f!%LNbblh+" x="212" y="276"><mutation><arg name="cantidad de lados"></arg><arg name="longitud"></arg></mutation><field name="NAME">Dibujar  figura</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="repetir" id="Z:Eckn~eDU8Of(+Css_~"><value name="count"><block type="variables_get" id="bKbIhx0By6{^ak%r-vO)"><field name="VAR" id="yd2]Tx-`eIbJbB/NJu8v" variabletype="">cantidad de lados</field></block></value><statement name="block"><block type="DibujarLado" id="G%OP!$j*K0XLV6v{CW4`"><value name="longitud"><block type="variables_get" id="_nVl4L/4*-Wx|tNjolso"><field name="VAR" id="kJIbvmiGNlG*Y.#3c)jX" variabletype="">longitud</field></block></value><next><block type="GirarGrados" id="-~m0=FrP`B2FUt=)03Y%"><value name="grados"><block type="OpAritmetica" id="{$Gf}XrBI._0:J}i;-o{"><field name="OP">DIVIDE</field><value name="A"><block type="math_number" id="?cRP~7R4l?z+:f+5$AWF"><field name="NUM">360</field></block></value><value name="B"><block type="variables_get" id=":%y`{J^,Wf,Zrw3y(4Bt"><field name="VAR" id="yd2]Tx-`eIbJbB/NJu8v" variabletype="">cantidad de lados</field></block></value></block></value></block></next></block></statement></block></statement></block><block type="math_number" id="FzSP^eJI~1oz,GuABI[5" disabled="true" x="424" y="365"><field name="NUM">100</field></block></xml>',
    resuelveDesafio: true
  });

});

moduloActividad('DibujoLibre', () => {

  actividadTest('DibujoLibre', {
    descripcionAdicional: 'Se tiene que poder dibujar libremente.',
    solucion: `<xml xmlns=\"http://www.w3.org/1999/xhtml\">
  <variables></variables>
  <block type=\"al_empezar_a_ejecutar\" deletable=\"false\" movable=\"false\" editable=\"false\" x=\"15\" y=\"15\">
    <statement name=\"program\">
      <block type=\"repetir\">
        <value name=\"count\">
          <block type=\"math_number\">
            <field name=\"NUM\">2</field>
          </block>
        </value>
        <statement name=\"block\">
          <block type=\"DibujarLado\">
            <value name=\"longitud\">
              <block type=\"math_number\">
                <field name=\"NUM\">75</field>
              </block>
            </value>
            <next>
              <block type=\"GirarGrados\">
                <value name=\"grados\">
                  <block type=\"math_number\">
                    <field name=\"NUM\">90</field>
                  </block>
                </value>
                <next>
                  <block type=\"SaltarHaciaAdelante\">
                    <value name=\"longitud\">
                      <block type=\"math_number\">
                        <field name=\"NUM\">100</field>
                      </block>
                    </value>
                    <next>
                      <block type=\"GirarGrados\">
                        <value name=\"grados\">
                          <block type=\"math_number\">
                            <field name=\"NUM\">90</field>
                          </block>
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
    </statement>
  </block>
  <block type=\"GirarGrados\" disabled=\"true\" x=\"58\" y=\"134\">
    <value name=\"grados\">
      <block type=\"math_number\">
        <field name=\"NUM\">90</field>
      </block>
    </value>
  </block>
</xml>`,
    resuelveDesafio: false
  });

  actividadTest('DibujoLibre', {
    descripcionAdicional: 'No se puede dividir por cero.',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="GirarGrados">
          <value name="grados">
            <block type="OpAritmetica">
              <field name="OP">DIVIDE</field>
              <value name="A">
                <block type="math_number">
                  <field name="NUM">90</field>
                </block>
              </value>
              <value name="B">
                <block type="math_number">
                  <field name="NUM">0</field>
                </block>
              </value>
            </block>
          </value>
        </block>
      </statement>
    </block>
  </xml>`,
    errorEsperado: "No se puede dividir por 0",
    resuelveDesafio: false
  });

  actividadTest('DibujoLibre', {
    descripcionAdicional: 'Se puede girar 0 grados.',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <variables></variables>
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="GirarGrados">
          <value name="grados">
            <block type="math_number">
              <field name="NUM">0</field>
            </block>
          </value>
        </block>
      </statement>
    </block>
  </xml>`,
    resuelveDesafio: false
  });

});