import { AppBar, Box, Button, ButtonGroup, Toolbar } from "@mui/material"
import Editor, { Monaco, OnMount } from "@monaco-editor/react";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import './Editor.css';
import { useEffect, useState } from "react";
import { processText } from "../Util/Processor";
import { File, FileProvider, FileStateParams } from "../Util/FileProvider";
import EditorOverlay from "./EditorOverlay";
import { DriveFileRenameOutline, Visibility, VerticalSplit } from "@mui/icons-material";
import { ButtonDark } from "../Util/StyledComponents";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import CommandBar from "./CommandBar";


export const VariableTag = styled.span`
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
}

const generateDecorations = (content: string) => {
  console.log(content)
  return []
}

const decorateEditor = (editor: monaco.editor.IStandaloneCodeEditor, decorations: string[]) => {
  editor.getValue()
  return editor.deltaDecorations(
    decorations,
    generateDecorations(editor.getValue())
  )
}


const SplitView = ({children, displayNum, desired}: {children: React.ReactNode, displayNum: number, desired: number}) => {
  let flexGrow = '1';
  let display = 'block'
  let width = 'auto'
  if (displayNum === 1) width = '50%'
  if (desired !== displayNum && displayNum !== 1) {
    flexGrow = '0'
    display = 'none'
    width = '0%'
  }
  return (<>
    <Box style={{ flexGrow, position: 'relative', display, width, minWidth: '0' }}>
      { children }  
    </Box>
  </>)
}


const EditorView = ({ openFile, setFiles, setOpenFile, files }: FileStateParams) => {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>()
  const [decorations, setDecorations] = useState<string[]>([])
  const [varContent, setVarContent] = useState<any>([])
  const [scroll, setScroll] = useState(0)
  const [viewMode, setViewMode] = useState(1)
  const [markdownContent, setMarkdownContent] = useState("")
  const editorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    console.log('Mounting editor')
    editor.onDidScrollChange(e => setScroll(e.scrollTop))
    setEditor(editor)
    // console.log(editor)
  }
  const onChange = (value: string) => {
    if (editor) {
      if (value !== openFile.content) {
        console.log('content change detected')
        FileProvider.UpdateFile(openFile.key, value)
        setFiles(FileProvider.GetFiles())
      }
      setDecorations(decorateEditor(editor, decorations))
      console.log('processing file')
      const { variables, content } = processText(value)
      setMarkdownContent(content)
      setVarContent(variables)
      console.log('processed variables ', variables)
    }
  }
  useEffect(() => {
    // console.log('opening', openFile.key, openFile)
    if (editor) {
      editor.setValue(openFile.content)
      onChange(openFile.content)
    }
    // onChange(openFile.content)
  }, [openFile, editor])
  return (
    <Box style={{ height: '100%', flexGrow: '1', position: 'relative', display: 'flex', flexDirection:'column', minWidth: '0', overflow: 'hidden' }}>
      <CommandBar {...{viewMode, setViewMode, openFile, setFiles, setOpenFile, files}}/>
      <Box style={{ display: 'flex', position: 'relative', flexGrow: '1', flexDirection: 'row', minWidth: '0', overflow: 'hidden' }}>
        <SplitView displayNum={viewMode} desired={0}>
          <EditorOverlay variables={varContent} scroll={scroll} display={viewMode === 0} />
          <Editor
            height="100%"
            theme="vs-dark"
            defaultLanguage="markdown"
            onMount={ editorDidMount }
            onChange={ value => onChange(value ?? "") }
            defaultValue={ openFile.content }
          />
        </SplitView>
        <SplitView displayNum={viewMode} desired={2}>
          <Box pl={3} style={{overflowY: 'scroll', height: '100%'}}>
            <ReactMarkdown components={{ code: Code }}>{ markdownContent }</ReactMarkdown>
          </Box>
        </SplitView>
      </Box>
    </Box>
  )
}

export default EditorView