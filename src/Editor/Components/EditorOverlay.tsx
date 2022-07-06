import { useEffect, useState } from "react";
import styled from "styled-components";

const Background = styled.div`
  position: absolute;
  top: 0;
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
  height: 19px;
  text-align: right;
  margin-right: 150px;
`;

type editorVariables = {[key: string]: any};

const EditorOverlay = ({variables, scroll}:{variables: editorVariables, scroll: number}) => {
  // console.log(variables)
  const varLines: string[] = [];
  if (!variables.lines) variables.lines = [];
  variables.lines.forEach(([line, value]: [line: number, value: string]) => {
    if (varLines[line]) {
      varLines[line] = varLines[line] + value
    } else {
      varLines[line] = value
    }
  })
  const varLinesPadded = Array.from(varLines, item => item || "")
  // console.log(varLines, varLinesPadded)
  const lines = varLinesPadded.map(line => <Line>{ line }</Line>)
  
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