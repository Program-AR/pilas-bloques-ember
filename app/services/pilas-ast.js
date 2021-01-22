
export function createNode(tag, contents) {
  if(tag === "Equation") return [contents];
  return contents !== undefined ? {tag, contents} : {tag};
}

export function createReference(block) {
  return createNode("Reference", block.type)
}

export function createEmptyNode() {
  return createNode("None", []);
}

