type Processor = {
  operators: string[],
  output: string[],
  variables: any[],
  lineNumber: number
};

const getOperatorsBetweenDelims = (operators: string[], start: string, end: string, options = {startAhead: true, useDepth: true}): string[] => {
  const evalOperators: string[] = [];
  // console.log(operators)
  if (options.startAhead) {
    if (operators[0].trim() !== start) return ["ERROR"]
    operators.shift() // get rid of the {
  }
  let nextOperator = operators.shift()
  // console.log(nextOperator)
  let depth = 0;
  while (nextOperator && !(nextOperator.trim() === end && (depth === 0 || !options.useDepth))) {
    const trimmedOperator = nextOperator.trim();
    if (trimmedOperator === start) depth++
    if (trimmedOperator === end) depth--
    evalOperators.push(trimmedOperator)
    // console.log('current', (nextOperator && !(nextOperator.trim() === end && depth === 0)))
    nextOperator = operators.shift();
    // console.log('next', (nextOperator && !(nextOperator.trim() === end && depth === 0))) 
  }
  // console.log(evalOperators)
  return evalOperators
}

function rawMath(fn: string) {
  // console.log('calculating', fn)
  try {
    return `\`${fn} = ${new Function('return ' + fn + '')() }\``
  } catch {
    return `\`Error: failed to evalutate ${fn}\``
  }
}

function rawEval(fn: string) {
  try {
    return new Function('return (()=>' + fn + ')()')();
  } catch {
    return `\`Error: failed to evalutate ${fn}\``
  }
}

const Eval: Command = (operator: string, processor: Processor) => {
  const evalOperators = getOperatorsBetweenDelims(processor.operators, '{', '}')
  const newLinesFixed = evalOperators.map(op => {
    if (op.includes('<NL>')) processor.lineNumber++
    return op.replace('<NL>', '\r\n')
  })
  const evalExpression = newLinesFixed.join(' ')
  const result = rawEval(evalExpression)
  return `${result}`
}

const Calc: Command = (operator: string, processor: Processor) => {
  const evalOperators = getOperatorsBetweenDelims(processor.operators, '(', ')')
  const newLinesFixed = evalOperators.map(op => {
    if (op.includes('<NL>')) processor.lineNumber++
    return op.replace('<NL>', '\r\n')
  })
  const evalExpression = newLinesFixed.join(' ')
  const result = rawMath(evalExpression)
  processor.variables.push({line:processor.lineNumber, value: result})
  return `${result}`
}

const getLast = (output: string[]) => {
  return output[output.length - 1]
}

const storeVariableGlobal = (key: string, value: string, processor: Processor) => {
  const store = window as {[key: string]: any};
  processor.variables.push({line: processor.lineNumber, value: `${key} = ${value}`})
  if (typeof value === "number") {store[key] = value; return}
  if ((value.match(/\d+/gm) ?? []).length > 0) {store[key] = parseInt(value); return}
  if ((value.match(/\w+/gm) ?? []).length > 0) {store[key] = value; return}
}

const getVariableGlobal = (key: string) => {
  const store = window as {[key: string]: any};
  return store[key]
}

const GetVar: Command = (operator: string, processor: Processor) => {
  const varName = processor.operators[0]
  const variable = getVariableGlobal(varName)
  processor.operators.shift()
  return variable ?? ""
}

const Var: Command = (operator: string, processor: Processor) => {
  const varName = getLast(processor.output)
  // console.log('setting', varName)
  let value = processOperators(processor);
  // console.log('evaluated value', value)
  if (value) storeVariableGlobal(varName, value, processor)
  return `${operator} ${value}`
}

const String: Command = (operator: string, processor: Processor) => {
  const evalOperators = getOperatorsBetweenDelims(processor.operators, '"', '"', {startAhead: false, useDepth: false})
  // console.log(evalOperators)
  const newLinesFixed = evalOperators.map(op => op.replace('<NL>', '\r\n'))
  const evalExpression = newLinesFixed.join(' ')
  return `"${evalExpression}"`
}

const Code: Command = (operator: string, processor: Processor) => {
  // console.log('code found')
  const evalOperators = getOperatorsBetweenDelims(processor.operators, '`', '`', {startAhead: false, useDepth: false})
  const newLinesFixed = evalOperators.map(op => op.replace('<NL>', '\r\n'))
  const evalExpression = newLinesFixed.join(' ')
  return "`" + evalExpression + "`"
}

type Command = (operator: string, processor: Processor) => string | undefined
const commands: {[key: string]: Command} = {
  "eval": Eval,
  "calc": Calc,
  "=": Var,
  "getvar": GetVar,
  "\"": String,
  "`": Code,
}

const processOperators = (processor: Processor) => {
  const operator = processor.operators.shift();
  if (operator) {
    const trimmedOperator = operator.trim();
    if (trimmedOperator === '<NL>') processor.lineNumber++;
    // console.log('processing ', operator)
    if (operator && commands[trimmedOperator]) return commands[trimmedOperator](trimmedOperator, processor)
  }
  return operator
}

const padCharacters = (text: string, chars: string) => {
  let output = text
  for (const char of chars) {
    // console.log('replacing ', char)
    output = output.replaceAll(char, ` ${char} `)
  }
  return output
}

export const processText = (text: string) => {
  const splitLines = text.replaceAll(/\r\n/gm, ' <NL> ')
  const paddedOperators = padCharacters(splitLines, '{}();"`')
  const operators = paddedOperators.match(/(?<= |;|^)(.+?)(?= |;|$)/gm) ?? []
  const processor: Processor = {
    operators: operators,
    output: [],
    lineNumber: 1,
    variables: []
  }
  // console.log(operators)
  while (operators.length > 0) {
    const res = processOperators(processor)
    if (res) processor.output.push(res)
  }
  const outputText = processor.output.join(' ')
  const outputLineBreaks = outputText.replaceAll(/\<NL\>/gm, '\r\n')
  // console.log(processor)
  return {
    content: outputLineBreaks,
    variables: processor.variables
  }
}