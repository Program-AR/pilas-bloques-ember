import { moduloActividad, actividadTest } from '../../../helpers/actividadTest';

moduloActividad("Lita - Primeros programas", () => {

  actividadTest("3.1.4a", {
    descripcionAdicional: '3.1.4a: Se puede resolver',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="AgarrarTomate">
                  <next>
                    <block type="MoverACasillaDerecha">
                      <next>
                        <block type="AgarrarLechuga">
                          <next>
                            <block type="MoverACasillaDerecha">
                              <next>
                                <block type="MoverACasillaAbajo">
                                  <next>
                                    <block type="PrepararEnsalada"></block>
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

  actividadTest("3.1.4a", {
    descripcionAdicional: "3.1.4a: Da error al chocarse un obstáculo",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaIzquierda"></block>
      </statement>
    </block>
  </xml>`,
    errorEsperado: "¡Hay un obstáculo!"
  });

  actividadTest("3.1.4a", {
    descripcionAdicional: "3.1.4a: Hacen falta tomate y lechuga",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="MoverACasillaDerecha">
                  <next>
                    <block type="MoverACasillaDerecha">
                      <next>
                        <block type="MoverACasillaAbajo">
                          <next>
                            <block type="PrepararEnsalada"></block>
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
    errorEsperado: "¡Todavía me quedan ingredientes por recoger!"
  });

  actividadTest("3.1.4a", {
    descripcionAdicional: "3.1.4a: Hace falta tomate",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="MoverACasillaDerecha">
                  <next>
                    <block type="AgarrarLechuga">
                      <next>
                        <block type="MoverACasillaDerecha">
                          <next>
                            <block type="MoverACasillaAbajo">
                              <next>
                                <block type="PrepararEnsalada"></block>
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
    errorEsperado: "¡Todavía me queda tomate por recoger!"
  });

  actividadTest("3.1.4a", {
    descripcionAdicional: "3.1.4a: Hace falta lechuga",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="AgarrarTomate">
                  <next>
                    <block type="MoverACasillaDerecha">
                      <next>
                        <block type="MoverACasillaDerecha">
                          <next>
                            <block type="MoverACasillaAbajo">
                              <next>
                                <block type="PrepararEnsalada"></block>
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
    errorEsperado: '¡Todavía me queda lechuga por recoger!'
  });

  actividadTest("3.1.4a", {
    descripcionAdicional: "3.1.4a: Solo se puede preparar ensalada si hay ensaladera",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="PrepararEnsalada"></block>
      </statement>
    </block>
  </xml>`,
    errorEsperado: "¡Acá no hay ensaladera!"
  });


  actividadTest("3.1.4a", {
    descripcionAdicional: "3.1.4a: Se chequea que se haya preparado la ensalada",
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="AgarrarTomate">
                  <next>
                    <block type="MoverACasillaDerecha">
                      <next>
                        <block type="AgarrarLechuga">
                          <next>
                            <block type="MoverACasillaDerecha">
                              <next>
                                <block type="MoverACasillaAbajo"></block>
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
    resuelveDesafio: false
  });


  actividadTest("3.1.4b", {
    descripcionAdicional: '3.1.4b: Se puede resolver',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaArriba">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="MoverACasillaDerecha">
                  <next>
                    <block type="AgarrarLechuga">
                      <next>
                        <block type="MoverACasillaArriba">
                          <next>
                            <block type="AgarrarTomate">
                              <next>
                                <block type="MoverACasillaAbajo">
                                  <next>
                                    <block type="MoverACasillaDerecha">
                                      <next>
                                        <block type="MoverACasillaDerecha">
                                          <next>
                                            <block type="MoverACasillaAbajo">
                                              <next>
                                                <block type="PrepararEnsalada"></block>
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


  actividadTest("3.2.2a", {
    descripcionAdicional: '3.2.2a: Se puede resolver (solución 1)',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaArriba">
              <next>
                <block type="AgarrarLechuga">
                  <next>
                    <block type="MoverACasillaAbajo">
                      <next>
                        <block type="MoverACasillaAbajo">
                          <next>
                            <block type="AgarrarTomate">
                              <next>
                                <block type="MoverACasillaArriba">
                                  <next>
                                    <block type="MoverACasillaDerecha">
                                      <next>
                                        <block type="PrepararEnsalada"></block>
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
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  });

  actividadTest("3.2.2a", {
    descripcionAdicional: '3.2.2a: Se puede resolver (solución 2)',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaAbajo">
              <next>
                <block type="AgarrarTomate">
                  <next>
                    <block type="MoverACasillaArriba">
                      <next>
                        <block type="MoverACasillaArriba">
                          <next>
                            <block type="AgarrarLechuga">
                              <next>
                                <block type="MoverACasillaAbajo">
                                  <next>
                                    <block type="MoverACasillaDerecha">
                                      <next>
                                        <block type="PrepararEnsalada"></block>
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
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  });


  actividadTest("3.2.2b", {
    descripcionAdicional: '3.2.3b: Se puede resolver',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaArriba">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="AgarrarLechuga">
                  <next>
                    <block type="MoverACasillaDerecha">
                      <next>
                        <block type="AgarrarTomate">
                          <next>
                            <block type="MoverACasillaDerecha">
                              <next>
                                <block type="MoverACasillaAbajo">
                                  <next>
                                    <block type="PrepararEnsalada"></block>
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


  actividadTest("3.2.2c", {
    descripcionAdicional: '3.2.3c: Se puede resolver',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaIzquierda">
          <next>
            <block type="MoverACasillaAbajo">
              <next>
                <block type="AgarrarLechuga">
                  <next>
                    <block type="MoverACasillaDerecha">
                      <next>
                        <block type="MoverACasillaDerecha">
                          <next>
                            <block type="AgarrarTomate">
                              <next>
                                <block type="MoverACasillaIzquierda">
                                  <next>
                                    <block type="PrepararEnsalada"></block>
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


  actividadTest("3.2.2d", {
    descripcionAdicional: '3.2.3d: Se puede resolver',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaAbajo">
          <next>
            <block type="AgarrarTomate">
              <next>
                <block type="MoverACasillaIzquierda">
                  <next>
                    <block type="AgarrarLechuga">
                      <next>
                        <block type="MoverACasillaAbajo">
                          <next>
                            <block type="MoverACasillaDerecha">
                              <next>
                                <block type="PrepararEnsalada"></block>
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


  actividadTest("3.2.3e", {
    descripcionAdicional: '3.2.3e: La solución provista no resuelve el problema',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="MoverACasillaDerecha">
                  <next>
                    <block type="AgarrarLechuga">
                      <next>
                        <block type="MoverACasillaArriba">
                          <next>
                            <block type="MoverACasillaDerecha">
                              <next>
                                <block type="MoverACasillaAbajo">
                                  <next>
                                    <block type="PrepararEnsalada"></block>
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
    errorEsperado: '¡Todavía me queda tomate por recoger!'
  });

  actividadTest("3.2.3e", {
    descripcionAdicional: '3.2.3e: La solución correcta resuelve el problema',
    solucion: `<xml xmlns="http://www.w3.org/1999/xhtml">
    <block type="al_empezar_a_ejecutar" deletable="false" movable="false" editable="false" x="15" y="15">
      <statement name="program">
        <block type="MoverACasillaDerecha">
          <next>
            <block type="MoverACasillaDerecha">
              <next>
                <block type="MoverACasillaDerecha">
                  <next>
                    <block type="AgarrarLechuga">
                      <next>
                        <block type="MoverACasillaArriba">
                          <next>
                            <block type="MoverACasillaDerecha">
                              <next>
                                <block type="AgarrarTomate">
                                  <next>
                                    <block type="MoverACasillaAbajo">
                                      <next>
                                        <block type="PrepararEnsalada"></block>
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
          </next>
        </block>
      </statement>
    </block>
  </xml>`,
  });

});
