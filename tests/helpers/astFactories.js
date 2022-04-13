export function procedure(name, params, ...seq) {
  return {
    tag: "Procedure",
    contents: [
      name,
      [
        equation(params, ...seq)
      ]
    ]
  }
}

export function equation(params, ...seq) {
  return [
    params.map(name => variable(name)),
    body(...seq)
  ]
}

export function variable(name) {
  return {
    tag: "VariablePattern",
    contents: name
  }
}

export function body(...seq) {
  return {
    tag: "UnguardedBody",
    contents: sequence(...seq)
  }
}


export function entryPoint(name, ...seq) {
  return {
    tag: "EntryPoint",
    contents: [
      name,
      sequence(...seq)
    ]
  }
}

export function sequence(...seq) {
  if (seq.length == 0) return none()
  if (seq.length == 1) return seq[0]
  return rawSequence(seq)
}

export function rawSequence(contents) {
  return {
    tag: "Sequence",
    contents
  }
}

export function reference(name) {
  return {
    tag: "Reference",
    contents: name
  }
}

export function application(name, ...params) {
  return {
    tag: "Application",
    contents: [
      reference(name),
      params
    ]
  }
}

export function repeat(count, ...seq) {
  return {
    tag: "Repeat",
    contents: [
      count,
      sequence(...seq)
    ]
  }
}

export function muIf(condition, ...seq) {
  return {
    tag: "If",
    contents: [
      condition,
      sequence(...seq),
      none()
    ]
  }
}

export function ifElse(condition, seqTrue, seqFalse) {
  return {
    tag: "If",
    contents: [
      condition,
      seqTrue,
      seqFalse
    ]
  }
}

export function muUntil(condition, ...seq) {
  return {
    tag: "While",
    contents: [
      primitiveApplication('Negation', condition),
      sequence(...seq)
    ]
  }
}

export function number(n) {
  return {
    tag: "MuNumber",
    contents: n
  }
}

export function string(s) {
  return {
    tag: "MuString",
    contents: s
  }
}

export function none() {
  return {
    tag: "None",
    contents: []
  }
}

function primitive(name) {
  return {
    tag: "Primitive",
    contents: name
  }
}

function primitiveApplication(name, ...params) {
  return {
    tag: "Application",
    contents: [primitive(name), params]
  }
}