
export function createNode(tag, contents) {
  if(tag === "Equation") return [contents];
  return contents !== undefined ? {tag, contents} : {tag};
}

export function createReference(name) {
  return createNode("Reference", name)
}

export function createEmptyNode() {
  return createNode("None", []);
}

