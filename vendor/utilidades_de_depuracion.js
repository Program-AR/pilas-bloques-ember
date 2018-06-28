function utils_obtener_xml() {
  return Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)).replace(/ id="[^"]*"/g,"");
}

function utils_cargar_xml(codigo) {
  var workspace = Blockly.getMainWorkspace();
  workspace.clear();
  var xml = Blockly.Xml.textToDom(codigo);
  Blockly.Xml.domToWorkspace(xml, workspace);
}

function utils_guardar_solucion_en_url() {
  var xml = utils_obtener_xml();
  var codigo = btoa(xml);
  window.location.href = window.location.href.split("?")[0] + "?codigo=" + encodeURIComponent(codigo);
  console.log("Se guardó correctamente la solución, ahora se puede recargar la página sin perder el workspace.");
}


// Por ejemplo utils_obtener_puntos("pizarraFantasma") ó bien utils_obtener_puntos("automata.pizarra")
function utils_obtener_puntos(pizarra, unificar = false){
  return PilasEngineBloques.__container__.cache['service:pilas'].evaluar(`DibujoLineal.desdePizarra(pilas.escena_actual().${pizarra}, ${unificar});`).stringPuntos();
}

function utils_obtener_svg() {
  function descargar(text, name, type) {
    var a = document.getElementById("placeholder");
    var file = new Blob([text], { type: type });
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
  }

  var workspace = Blockly.getMainWorkspace();
  var aleph = workspace.svgBlockCanvas_.cloneNode(true);
  aleph.removeAttribute("width");
  aleph.removeAttribute("height");
  aleph.removeAttribute("transform");
  
  var cssContent = Blockly.Css.CONTENT.join('').replace(/font-family: sans-serif/g, "font-weight:bold;font-family: Arial");
  var css = '<defs><style type="text/css" xmlns="http://www.w3.org/1999/xhtml"><![CDATA[' + cssContent + ']]></style></defs>';
  
  if (aleph.children[0] !== undefined) {
    aleph.children[0].removeAttribute("transform");
    aleph.children[0].children[0].removeAttribute("transform");
  }
  
  aleph.querySelectorAll(".blocklyPathLight").forEach(function(elem) {elem.setAttribute("fill", "none")});
  if (document.getElementsByClassName("aplicar-modo-lectura-simple").length > 0) {
    aleph.querySelectorAll(".blocklyText").forEach(function (elem) { elem.textContent = elem.textContent.toUpperCase() });
  }

  // aleph.querySelectorAll("image").forEach(function (img) {
  //   console.log(img);
  //   var obj = document.createElement("object");
  //   obj.setAttribute("data", img.href.baseVal);
  //   document.body.appendChild(obj);
  //   obj.onload = function() {
  //     var xml = new XMLSerializer().serializeToString(obj.contentDocument)
  //     img.setAttribute("href", "data:image/svg+xml;base64," + btoa(xml));
  //     obj.remove();
  //   };
  // });

  var bbox = document.getElementsByClassName("blocklyBlockCanvas")[0].getBBox();
  var xmlContent = new XMLSerializer().serializeToString(aleph);
  xml = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+bbox.width+'" height="'+bbox.height+'" viewBox="0 0 '+bbox.width+' '+bbox.height+'">'+css+'<rect width="100%" height="100%" fill="white"></rect>'+xmlContent+'</svg>';
  descargar(xml, 'bloques.svg', 'image/svg+xml');
}
