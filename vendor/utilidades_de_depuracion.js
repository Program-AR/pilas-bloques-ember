var pbUtils = {
  _descargar: function(textOrBlob, name, type = undefined) {
    var a = document.getElementById("placeholder");
    var file;
    if ((typeof textOrBlob) == "string") {
      file = new Blob([textOrBlob], { type: type });
    }
    else {
      file = textOrBlob;
    }
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
  },

  obtenerSolucionXml: function(withIds) {
    var text = Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace))
    return withIds ? text : text.replace(/ id="[^"]*"/g, "");
  },

  cargarSolucionXml: function(codigo) {
    var workspace = Blockly.getMainWorkspace();
    workspace.clear();
    var xml = Blockly.Xml.textToDom(codigo);
    Blockly.Xml.domToWorkspace(xml, workspace);
  },

  guardarSolucionEnUrl: function() {
    var xml = this.obtenerSolucionXml(true);
    var codigo = btoa(xml);
    window.location.href = window.location.href.split("?")[0] + "?codigo=" + encodeURIComponent(codigo);
    console.log("Se guardó correctamente la solución, ahora se puede recargar la página sin perder el workspace.");
  },

  // Por ejemplo utils.obtenerPuntosDePizarra("pizarraFantasma") ó bien utils.obtenerPuntosDePizarra("automata.pizarra")
  obtenerPuntosDePizarra: function(pizarra, unificar = false) {
    return Pilasbloques.__container__.cache['service:pilas'].evaluar(`DibujoLineal.desdePizarra(pilas.escena_actual().${pizarra}, ${unificar});`).stringPuntos();
  },

  obtenerBloquesSvg: function() {
    var workspace = Blockly.getMainWorkspace();
    var aleph = workspace.svgBlockCanvas_.cloneNode(true);
    aleph.removeAttribute("width");
    aleph.removeAttribute("height");
    aleph.removeAttribute("transform");

    var cssContent = Blockly.Css.CONTENT.join('').replace(/font-family: sans-serif/g, "font-weight:bold;font-family: Arial");
    var css = '<defs><style type="text/css" xmlns="http://www.w3.org/1999/xhtml"><![CDATA[' + cssContent + ']]></style></defs>';

    if (aleph.children[0] !== undefined) {
      aleph.children[0].removeAttribute("transform");
    }

    aleph.querySelectorAll(".blocklyPathLight").forEach(function (elem) { elem.setAttribute("fill", "none") });
    if (document.getElementsByClassName("simple-read-mode").length > 0) {
      aleph.querySelectorAll(".blocklyText").forEach(function (elem) { elem.textContent = elem.textContent.toUpperCase() });
    }

    var bbox = document.getElementsByClassName("blocklyBlockCanvas")[0].getBBox();
    var xmlContent = new XMLSerializer().serializeToString(aleph);
    xml = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + bbox.width + '" height="' + bbox.height + '" viewBox="0 0 ' + bbox.width + ' ' + bbox.height + '">' + css + '<rect width="100%" height="100%" fill="white"></rect>' + xmlContent + '</svg>';
    this._descargar(xml, 'bloques.svg', 'image/svg+xml');
  },

  eliminarFondo: function() {
    PilasEngineBloques.__container__.cache['service:pilas'].evaluar(`pilas.escena_actual().fondo.eliminar();`);
    document.getElementsByClassName("content-spinner")[0].innerHTML = '';
    document.getElementsByClassName("iframe-pilas-canvas")[0].style['background-color'] = 'white';
  },

  obtenerEscenaPng: function() {
    var pilasIframe = document.querySelector('.iframe-pilas-canvas').contentDocument;
    var pilasCanvas = pilasIframe.querySelector('canvas');
    pilasCanvas.toBlob(function (blob) { pbUtils._descargar(blob, 'escena.png')});
  }
}
