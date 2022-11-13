import { useEffect, useState } from "react";
import styled from "styled-components";
import { VariableTag } from "./EditorView";

const Background = styled.div`
  position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Cutoff = styled.div`
position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Scroller = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  display: flex;
  flex-direction: column;
  pointer-events: none;
`;

const Line = styled.span`
  position: relative;
  min-height: 19px; 
  text-align: right;
  margin-right: 150px;
`;

type editorVariables = {line: number, value: string}[];

const EditorOverlay = ({variables, scroll, display}:{variables: editorVariables, scroll: number, display: boolean}) => {
  if (!display) return <></>
  console.log('rendering overlay with', variables)
  const varLines: string[] = [];
  if (!variables) return <></>
  variables.forEach(({line, value}: {line: number, value: string}) => {
    if (varLines[line]) {
      varLines[line] = varLines[line] + value + ";"
    } else {
      varLines[line] = value + "; "
    }
  })
  varLines.shift();
  const varLinesPadded = Array.from(varLines, item => item || "")
  console.log(varLines, varLinesPadded)
  const lines = varLinesPadded.map(line => {
    if (line) return <Line><VariableTag>{ line }</VariableTag></Line>
    return <Line></Line>
  })
  console.log(lines)
  
  return (
    <Background>
      <Cutoff>
        <Scroller style={{top: `-${scroll}px`}}>
          { lines }
        </Scroller>
      </Cutoff>
    </Background>
  );
}

export default EditorOverlay;