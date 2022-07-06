type Processor = {
  operators: string[],
  output: string[],
  variables: any[],
  lineNumber: number
};

const getOperatorsBetweenDelims = (operators: string[], start: string, end: string, options = {startAhead: true, useDepth: true}): string[] => {
  const evalOperators: string[] = [];
  console.log(operators)
  if (options.startAhead) {
    if (operators[0].trim() !== start) return ["ERROR"]
    operators.shift() // get rid of the {
  }
  let nextOperator = operators.shift()
  console.log(nextOperator)
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
  console.log(evalOperators)
  return evalOperators
}

function rawMath(fn: string) {
  console.log('calculating', fn)
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

const Eval: Command = (operator: string, operators: string[], output: string[]) => {
  const evalOperators = getOperatorsBetweenDelims(operators, '{', '}')
  const newLinesFixed = evalOperators.map(op => op.replace('<NL>', '\r\n'))
  const evalExpression = newLinesFixed.join(' ')
  const result = rawEval(evalExpression)
  return `${result}`
}

const Calc: Command = (operator: string, operators: string[], output: string[]) => {
  const evalOperators = getOperatorsBetweenDelims(operators, '(', ')')
  const newLinesFixed = evalOperators.map(op => op.replace('<NL>', '\r\n'))
  const evalExpression = newLinesFixed.join(' ')
  const result = rawMath(evalExpression)
  return `${result}`
}

const getLast = (output: string[]) => {
  return output[output.length - 1]
}

const storeVariableGlobal = (key: string, value: string) => {
  const store = window as {[key: string]: any};
  variables.push({line: lineNumber, value: `${key} = ${value}`})
  if (typeof value === "number") {store[key] = value; return}
  if ((value.match(/\d+/gm) ?? []).length > 0) {store[key] = parseInt(value); return}
  if ((value.match(/\w+/gm) ?? []).length > 0) {store[key] = value; return}
}

const getVariableGlobal = (key: string) => {
  const store = window as {[key: string]: any};
  return store[key]
}

const GetVar: Command = (operator: string, operators: string[], output: string[]) => {
  const varName = operators[0]
  const variable = getVariableGlobal(varName)
  operators.shift()
  return variable ?? ""
}

const Var: Command = (operator: string, operators: string[], output: string[]) => {
  const varName = getLast(output)
  console.log('setting', varName)
  let value = processOperators(operators, output);
  console.log('evaluated value', value)
  if (value) storeVariableGlobal(varName, value)
  return `${operator} ${value}`
}

const String: Command = (operator: string, operators: string[], output: string[]) => {
  const evalOperators = getOperatorsBetweenDelims(operators, '"', '"', {startAhead: false, useDepth: false})
  console.log(evalOperators)
  const newLinesFixed = evalOperators.map(op => op.replace('<NL>', '\r\n'))
  const evalExpression = newLinesFixed.join(' ')
  return `"${evalExpression}"`
}

const Code: Command = (operator: string, operators: string[], output: string[]) => {
  console.log('code found')
  const evalOperators = getOperatorsBetweenDelims(operators, '`', '`', {startAhead: false, useDepth: false})
  const newLinesFixed = evalOperators.map(op => op.replace('<NL>', '\r\n'))
  const evalExpression = newLinesFixed.join(' ')
  return "`" + evalExpression + "`"
}

type Command = (operator: string, operators: string[], output: string[]) => string | undefined
const commands: {[key: string]: Command} = {
  "eval": Eval,
  "calc": Calc,
  "=": Var,
  "getvar": GetVar,
  "\"": String,
  "`": Code,
}

const processOperators = (operators: string[], output: string[]) => {
  const operator = operators.shift();
  if (operator) {
    const trimmedOperator = operator.trim();
    if (trimmedOperator === '<NL>') lineNumber++;
    // console.log('processing ', operator)
    if (operator && commands[trimmedOperator]) return commands[trimmedOperator](trimmedOperator, operators, output)
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

let lineNumber = 1
let variables = [];
export const processText = (text: string) => {
  lineNumber = 1;
  let variables: {[key: string]: any} = [];
  const splitLines = text.replaceAll(/\r\n/gm, ' <NL> ')
  const paddedOperators = padCharacters(splitLines, '{}();"`')
  const operators = paddedOperators.match(/(?<= |;|^)(.+?)(?= |;|$)/gm) ?? []
  const output: string[] = [];
  console.log(operators)
  while (operators.length > 0) {
    const res = processOperators(operators, output)
    if (res) output.push(res)
  }
  const outputText = output.join(' ')
  const outputLineBreaks = outputText.replaceAll(/\<NL\>/gm, '\r\n')
  // console.log(outputText)
  console.log(variables)
  return {
    content: outputLineBreaks,
    variables: variables
  }
}