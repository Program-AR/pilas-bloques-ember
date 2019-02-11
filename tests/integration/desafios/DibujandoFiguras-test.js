import {moduloActividad, actividadTest} from '../../helpers/actividadTest';

moduloActividad('DibujandoAlCuadrado');

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

moduloActividad('DibujandoRayuelaRobotica');

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

moduloActividad('DibujandoCortoPorLaDiagonal');

actividadTest('DibujandoCortoPorLaDiagonal', {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="3" inline="true"><value name="count"><block type="math_number" id="4"><field name="NUM">5</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="5"><mutation name="Dibujar cuadrado de 50"></mutation><next><block type="DibujarLado" id="6" inline="true"><value name="longitud"><block type="math_number" id="7"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="50" inline="true"><value name="grados"><block type="math_number" id="51"><field name="NUM">90</field></block></value><next><block type="DibujarLado" id="28" inline="true"><value name="longitud"><block type="math_number" id="29"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="58" inline="true"><value name="grados"><block type="math_number" id="59"><field name="NUM">270</field></block></value></block></next></block></next></block></next></block></next></block></statement></block></statement></block><block type="procedures_defnoreturn" id="8" x="348" y="-9"><mutation></mutation><field name="NAME">Dibujar cuadrado de 50</field><statement name="STACK"><block type="repetir" id="9" inline="true"><value name="count"><block type="math_number" id="10"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id="11" inline="true"><value name="longitud"><block type="math_number" id="12"><field name="NUM">50</field></block></value><next><block type="GirarGrados" id="13" inline="true"><value name="grados"><block type="math_number" id="14"><field name="NUM">90</field></block></value></block></next></block></statement></block></statement></block></xml>',
});

moduloActividad('DibujandoMamushkaCuadrada');

actividadTest('DibujandoMamushkaCuadrada', {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="2" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="5" inline="true"><mutation name="Dibujar cuadrado de 50"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="30"><field name="NUM">50</field></block></value><next><block type="procedures_callnoreturn" id="36" inline="true"><mutation name="Dibujar cuadrado de 50"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="33"><field name="NUM">100</field></block></value><next><block type="procedures_callnoreturn" id="39" inline="true"><mutation name="Dibujar cuadrado de 50"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="43"><field name="NUM">150</field></block></value><next><block type="procedures_callnoreturn" id="46" inline="true"><mutation name="Dibujar cuadrado de 50"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="48"><field name="NUM">200</field></block></value></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="14" x="4" y="290"><mutation><arg name="largo lado"></arg></mutation><field name="NAME">Dibujar cuadrado de 50</field><statement name="STACK"><block type="repetir" id="15" inline="true"><value name="count"><block type="math_number" id="16"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id="17" inline="true"><value name="longitud"><block type="param_get" id="27"><field name="VAR">largo lado</field></block></value><next><block type="GirarGrados" id="19" inline="true"><value name="grados"><block type="math_number" id="20"><field name="NUM">90</field></block></value></block></next></block></statement></block></statement></block></xml>',
});

moduloActividad('DibujandoEscaleraCuadrada');

actividadTest('DibujandoEscaleraCuadrada', {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="20" inline="true"><mutation name="Dibujar cuadrado"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="21"><field name="NUM">100</field></block></value><next><block type="procedures_callnoreturn" id="72"><mutation name="Ir Siguiente grande"></mutation><next><block type="repetir" id="104" inline="true"><value name="count"><block type="math_number" id="105"><field name="NUM">4</field></block></value><statement name="block"><block type="procedures_callnoreturn" id="22" inline="true"><mutation name="Dibujar cuadrado"><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="23"><field name="NUM">50</field></block></value><next><block type="DibujarLado" id="86" inline="true"><value name="longitud"><block type="math_number" id="87"><field name="NUM">50</field></block></value></block></next></block></statement></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="47" x="413" y="200"><mutation></mutation><field name="NAME">Ir Siguiente grande</field><statement name="STACK"><block type="DibujarLado" id="56" inline="true"><value name="longitud"><block type="math_number" id="57"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="39" inline="true"><value name="grados"><block type="math_number" id="40"><field name="NUM">90</field></block></value><next><block type="DibujarLado" id="62" inline="true"><value name="longitud"><block type="math_number" id="63"><field name="NUM">100</field></block></value></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="28" x="40" y="301"><mutation><arg name="largo lado"></arg></mutation><field name="NAME">Dibujar cuadrado</field><statement name="STACK"><block type="repetir" id="29" inline="true"><value name="count"><block type="math_number" id="30"><field name="NUM">4</field></block></value><statement name="block"><block type="DibujarLado" id="31" inline="true"><value name="longitud"><block type="param_get" id="32"><field name="VAR">largo lado</field></block></value><next><block type="GirarGrados" id="33" inline="true"><value name="grados"><block type="math_number" id="34"><field name="NUM">90</field></block></value></block></next></block></statement></block></statement></block></xml>',
});

moduloActividad('DibujandoHexagono');

actividadTest('DibujandoHexagono', {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="29" inline="true"><value name="count"><block type="math_number" id="30"><field name="NUM">6</field></block></value><statement name="block"><block type="DibujarLado" id="31" inline="true"><value name="longitud"><block type="math_number" id="128"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="33" inline="true"><value name="grados"><block type="math_number" id="34"><field name="NUM">60</field></block></value></block></next></block></statement></block></statement></block></xml>',
});

moduloActividad('DibujandoPiramideInvertida');

actividadTest('DibujandoPiramideInvertida', {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="repetir" id="29" inline="true"><value name="count"><block type="math_number" id="30"><field name="NUM">3</field></block></value><statement name="block"><block type="DibujarLado" id="31" inline="true"><value name="longitud"><block type="math_number" id="128"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="33" inline="true"><value name="grados"><block type="math_number" id="34"><field name="NUM">120</field></block></value></block></next></block></statement></block></statement></block></xml>',
});

moduloActividad('DibujandoFigurasDentroDeFiguras');

actividadTest('DibujandoFigurasDentroDeFiguras', {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="177" inline="true"><mutation name="Dibujar poligono de lados"><arg name="cantidad"></arg></mutation><value name="ARG0"><block type="math_number" id="179"><field name="NUM">3</field></block></value><next><block type="procedures_callnoreturn" id="191" inline="true"><mutation name="Dibujar poligono de lados"><arg name="cantidad"></arg></mutation><value name="ARG0"><block type="math_number" id="196"><field name="NUM">4</field></block></value><next><block type="procedures_callnoreturn" id="194" inline="true"><mutation name="Dibujar poligono de lados"><arg name="cantidad"></arg></mutation><value name="ARG0"><block type="math_number" id="198"><field name="NUM">5</field></block></value></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="130" x="47" y="191"><mutation><arg name="cantidad"></arg></mutation><field name="NAME">Dibujar poligono de lados</field><statement name="STACK"><block type="repetir" id="29" inline="true"><value name="count"><block type="param_get" id="149"><field name="VAR">cantidad</field></block></value><statement name="block"><block type="DibujarLado" id="31" inline="true"><value name="longitud"><block type="math_number" id="128"><field name="NUM">100</field></block></value><next><block type="GirarGrados" id="33" inline="true"><value name="grados"><block type="math_arithmetic" id="139" inline="true"><field name="OP">DIVIDE</field><value name="A"><block type="math_number" id="34"><field name="NUM">360</field></block></value><value name="B"><block type="param_get" id="137"><field name="VAR">cantidad</field></block></value></block></value></block></next></block></statement></block></statement></block></xml>',
});

actividadTest('DibujandoFigurasDentroDeFiguras', {
  descripcionAdicional:'Al tener un bloque con un id que contenga el caracter $, deberia funcionar correctamente, previo a la resolucion del issue no andaba',
  solucion:'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="!kYgjw}3BbbVT];Yv4b," deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="procedures_callnoreturn" id="~z.SKruYLd7ntE*e#(_$"><mutation name="hacer algo"><arg name="x"></arg><arg name="y"></arg></mutation><value name="ARG0"><block type="Numero" id="dTBs`2W#STpQ@+,/A|fJ"><field name="NUM">5</field></block></value><value name="ARG1"><block type="Numero" id="EqjKl{!]VKN(NDE-AB{y"><field name="NUM">100</field></block></value></block></statement></block><block type="procedures_defnoreturn" id="H~9q2sAlzr}D${9*Gf?$" x="178" y="222"><mutation><arg name="x"></arg><arg name="y"></arg></mutation><field name="NAME">hacer algo</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="RepetirVacio" id="IvT|[DBp5hGl69d?MM+e"><value name="count"><block type="variables_get" id="D`z2HeUFp,Lui3K(fp(m"><field name="VAR">x</field></block></value><statement name="block"><block type="DibujarLado" id="BIlSM-5bS2q:-5GMflNm"><value name="longitud"><block type="variables_get" id="j}q):ve!%T4veFV6kNU("><field name="VAR">y</field></block></value><next><block type="GirarGrados" id="t;Wxq8lrT:0Nk;J1ArOB"><value name="grados"><block type="OpAritmetica" id="+01IVklSNUtmhe74QS!R"><field name="OP">DIVIDE</field><value name="A"><block type="math_number" id="j,LtYNSPYNJy;?$2(BN5"><field name="NUM">360</field></block></value><value name="B"><block type="variables_get" id="XDuk8LG4[qOtcx|(vCc4"><field name="VAR">x</field></block></value></block></value></block></next></block></statement></block></statement></block><block type="math_number" id="?daCSErBq`I+6(.IbLZb" disabled="true" x="420" y="543"><field name="NUM">100</field></block></xml>',
  resuelveDesafio: false,
});

actividadTest('DibujandoFigurasDentroDeFiguras', {
  descripcionAdicional:'Al tener un bloque con un id que contenga el caracter $, deberia funcionar correctamente, previo a la resolucion del issue andaba',
  solucion:'<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="ov:a}`,YO)1u@{;$U/*D" deletable="false" movable="false" editable="false" x="15" y="15"><statement name="program"><block type="procedures_callnoreturn" id="Pb4ovzuf:+KRB*cG/@U5"><mutation name="hacer algo"><arg name="x"></arg><arg name="y"></arg></mutation><value name="ARG0"><block type="math_number" id="!vWiv@U1{9J^W9NN.cAa"><field name="NUM">10</field></block></value><value name="ARG1"><block type="math_number" id="(3ecL:P)78xcO!mYo]NQ"><field name="NUM">10</field></block></value></block></statement></block><block type="procedures_defnoreturn" id="3-Wztz*X,htVX|P=0iWH" x="117" y="115"><mutation><arg name="x"></arg><arg name="y"></arg></mutation><field name="NAME">hacer algo</field><comment pinned="false" h="80" w="160">Describe esta funcin...</comment><statement name="STACK"><block type="repetir" id="Yh_Dt+iV%(fQ2+,.I[D/"><value name="count"><block type="variables_get" id="$EHWhV+/2{W%4@piBs)a"><field name="VAR">y</field></block></value><statement name="block"><block type="DibujarLado" id="1rv~K7(]XaZxH,NqUR7i"><value name="longitud"><block type="math_number" id="{U:Czfjj@s]0DX:rqfKw"><field name="NUM">100</field></block></value><next><block type="DibujarLado" id="aew17*cc0_]{%.QjYTf|"><value name="longitud"><block type="OpAritmetica" id="I|2.;o#9!^WpuAA^E*||"><field name="OP">DIVIDE</field><value name="A"><block type="math_number" id="5T[o1Wm(UGWyi(21-jEU"><field name="NUM">100</field></block></value><value name="B"><block type="variables_get" id="a{)fh?b(n+WA/J=$,d^{"><field name="VAR">x</field></block></value></block></value></block></next></block></statement></block></statement></block><block type="variables_get" id="KDJ5@i|7z@9lfknqAft%" disabled="true" x="272" y="503"><field name="VAR">x</field></block></xml>',
  resuelveDesafio: false,
});

moduloActividad('DibujandoLaCuevaDeEstalagtitas');

actividadTest('DibujandoLaCuevaDeEstalagtitas', {
	solucion: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="al_empezar_a_ejecutar" id="19" deletable="false" movable="false" editable="false" x="0" y="0"><statement name="program"><block type="procedures_callnoreturn" id="352" inline="true"><mutation name="Dibujar poligono"><arg name="cantidad"></arg><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="366"><field name="NUM">4</field></block></value><value name="ARG1"><block type="math_number" id="368"><field name="NUM">200</field></block></value><next><block type="procedures_callnoreturn" id="343" inline="true"><mutation name="Dibujar poligono"><arg name="cantidad"></arg><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="354"><field name="NUM">3</field></block></value><value name="ARG1"><block type="math_number" id="356"><field name="NUM">40</field></block></value><next><block type="DibujarLado" id="317" inline="true"><value name="longitud"><block type="math_number" id="318"><field name="NUM">40</field></block></value><next><block type="procedures_callnoreturn" id="346" inline="true"><mutation name="Dibujar poligono"><arg name="cantidad"></arg><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="358"><field name="NUM">3</field></block></value><value name="ARG1"><block type="math_number" id="360"><field name="NUM">60</field></block></value><next><block type="DibujarLado" id="333" inline="true"><value name="longitud"><block type="math_number" id="334"><field name="NUM">60</field></block></value><next><block type="procedures_callnoreturn" id="349" inline="true"><mutation name="Dibujar poligono"><arg name="cantidad"></arg><arg name="largo lado"></arg></mutation><value name="ARG0"><block type="math_number" id="362"><field name="NUM">3</field></block></value><value name="ARG1"><block type="math_number" id="364"><field name="NUM">100</field></block></value></block></next></block></next></block></next></block></next></block></next></block></statement></block><block type="procedures_defnoreturn" id="130" x="59" y="315"><mutation><arg name="cantidad"></arg><arg name="largo lado"></arg></mutation><field name="NAME">Dibujar poligono</field><statement name="STACK"><block type="repetir" id="29" inline="true"><value name="count"><block type="param_get" id="149"><field name="VAR">cantidad</field></block></value><statement name="block"><block type="DibujarLado" id="31" inline="true"><value name="longitud"><block type="param_get" id="210"><field name="VAR">largo lado</field></block></value><next><block type="GirarGrados" id="33" inline="true"><value name="grados"><block type="math_arithmetic" id="139" inline="true"><field name="OP">DIVIDE</field><value name="A"><block type="math_number" id="34"><field name="NUM">360</field></block></value><value name="B"><block type="param_get" id="137"><field name="VAR">cantidad</field></block></value></block></value></block></next></block></statement></block></statement></block></xml>',
});
