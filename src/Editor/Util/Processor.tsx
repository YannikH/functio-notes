import styled from "styled-components";
import React from "react";

export type Processor = {
  start: string,
  end: string,

}

const isVariable = (text: string) => {
  if (text.includes('\r\n')) return false;
  const varFindRegex = /(^|(?<= ))\S+ = ((\S+)(?=;)|.+$)/gm;
  return (text.match(varFindRegex) ?? []).length > 0
}

const VariableTag = styled.span`
  color: #f7f7f7;
  background-color: #626161;
  padding: 0px 3px;
  border-radius: 5px;
  border: solid 1px gray;
  margin-right: 10px;
`;

export const Code = (args: any) => {
  const text = args.children[0];
  return (<VariableTag>{text}</VariableTag>)
  // if (isVariable(text)) {
  //   return (<VariableTag>{text}</VariableTag>)
  // }
  // return <code>{text}</code>
}

const MathOperation = (operator: string, left: number, right: number): number => {
  switch(operator) {
    case "/": return left / right;
    case "*": return left * right;
    case "x": return left * right;
    case "-": return left - right;
    case "+": return left + right;
  }
  return NaN
}

const advancedParseInt = (text: string): number => {
  const number = (text.match(/-?\d+/gm))
  if (number) return parseInt(number[0])
  return NaN
}

const Calculate = (text: string, depth: number): string => {
  console.log('entering calculator with', text)
  depth += 1
  let editedText = text;
  // parentheses
  const opening = text.indexOf("(")
  const closing = text.lastIndexOf(")")
  if (opening > -1 && closing > -1) {
    const subString = editedText.substring(opening + 1, closing)
    editedText = editedText.replace(subString, Calculate(subString, depth))
    console.log("continuing after parentheses with ", editedText)
  }
  const regexes = [
    // /(-?\d+)|(\/|\*|x)/gm, //multdiv
    // /(-?\d+)|(\+|-)/gm, //addsub
    /^(\/|\*|x)$/g, //multdiv
    /^(\+|-)$/g, //addsub
  ]
  regexes.forEach(regexp => {
    // const split = editedText.match(regexp)
    const split = editedText.match(/(-?\d+)|((?<= )|\d)(\+|-|x|\/|\*)((?= )|\d)|(((?<= )|^).+?(?= ))/gm)
    console.log(split)
    split?.forEach((value, index) => {
      const splitCopy = [...split];
      const isOperator = value.match(regexp)
      // console.log('searching in', splitCopy, ' at ', index, ' with ', value)
      if (isOperator) {
        const left = splitCopy[index - 1]
        const right = splitCopy[index + 1]
        if(left && right) {
          
          const result = MathOperation(value, advancedParseInt(left), advancedParseInt(right))
          splitCopy.splice(index - 1, 3, `${result}`)
          console.log('calculating', left, value, right, 'with result = ', result, 'leftover function is ', split.join(' '))
          editedText =  Calculate(splitCopy.join(' '), 0)
        }
      }
    })
  })
  console.log('outputting ' + editedText, ' from text ', depth)
  return editedText
}

const insertVariables = (line: string, variables: any) => {
  let outputText = line;
  const varRegex = /\$\w+((?=( |\))|$))/gm;
  const results = line.match(varRegex);
  results?.forEach(match => {
    console.log(match)
    const varName = match.replace('$', '');
    if (variables[varName]) {
      const regex = new RegExp(`\\${match}`);
      console.log(regex)
      outputText = outputText.replace(regex, variables[varName].value)
      console.log('replacing', line, "|||", varName, "|||", variables[varName].value)
      console.log(outputText)
    }
  });
  return outputText
}


const extractVariables = (text: string, index: number, variables: any) => {
  const varFindRegex = /(^|(?<= ))\S+ ?= ?((\S+)(?=;)|.+$)/gm;
  const results = text.match(varFindRegex)
  const inlineVars: Array<string> = [];
  results?.forEach(res => {
    let [key, value] = res.split('=');
    key = key.replace('$', '')
    variables[key.trim()] = value
    variables['lines'].push([index, `\`${key.trim()} = ${value.trim()}\``])
    inlineVars.push(`\`${key.trim()} = ${value.trim()}\``)
  })
  return inlineVars.join(' ')
}

const processLine = (line: string, index: number, variables: any) => {
  const editedText = insertVariables(line, variables);
  const vars = extractVariables(editedText, index, variables)
  console.log(editedText)
  const calculatedText = Calculate(editedText, 0)
  return (vars + calculatedText)
}


export const processText = (text: string) => {
  const lines = text.split("\n");
  let variables: {[key: string]: any} = {
    lines: []
  };
  const processedLines = lines.map((line, index) => processLine(line, index, variables))
  // console.log(variables)
  // console.log(lines, processedLines)
  const output = processedLines.join("\r  \n")
  // console.log(text)
  // console.log(output)
  return {
    content: output,
    variables
  }
}