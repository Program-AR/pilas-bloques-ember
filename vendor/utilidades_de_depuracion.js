function utils_obtener_xml() {
  return Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
}

function utils_cargar_xml(codigo) {
  var workspace = Blockly.getMainWorkspace();
  workspace.clear();
  var xml = Blockly.Xml.textToDom(codigo);
  Blockly.Xml.domToWorkspace(xml, workspace);
}
