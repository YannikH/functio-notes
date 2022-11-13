import { Box } from "@mui/material"
import React from "react";
import { useState } from "react";
import styled from "styled-components"
import Navbar from "./Common/Navbar"
import EditorView from "./Components/EditorView";
import Sidebar from "./Components/Sidebar";
import RichEditor from "./Components/Quill";
import { File, FileProvider } from "./Util/FileProvider"

const AppContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  align-items: start;
  width: 100%;
  display: relative;
  overflow: hidden;
  min-width: 0;
`;

const EditorApp = () => {
  const filesLoaded = FileProvider.GetFiles()
  const [files, setFiles] = useState<File[]>(filesLoaded);
  const [openFile, setOpenFile] = useState<File>(files[0])
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <Navbar />
      <AppContent>
        <Sidebar {...{ openFile, setFiles, setOpenFile, files }}></Sidebar>
        {/* <EditorView {...{openFile, setFiles, setOpenFile, files}}></EditorView> */}
        <RichEditor  {...{openFile, setFiles, setOpenFile, files}}></RichEditor>
      </AppContent>
    </Box>
  )
}

export default EditorApp