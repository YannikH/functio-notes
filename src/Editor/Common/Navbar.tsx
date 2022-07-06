import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import styled from "styled-components";
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MinimizeIcon from '@mui/icons-material/Minimize';
import React from "react";
// import Electron from "electron"

const DragBar = styled(AppBar)`
`;

const RoundButton = styled(Button)`
  border-radius: 18px !important;
  min-width: 36px !important;
  width: 36px !important;
  background-color: #505050 !important;
  color: white !important;
  margin-right: 5px !important;
`;

const ButtonContainer = styled.div`
  /* padding-right: 40px; */
`;


const Dragger = styled.div`
  flex-grow: 1;
  -webkit-app-region: drag;
`;

const Navbar = () => {
  const minimize = () => {
    // Electron.BrowserWindow.getFocusedWindow()?.minimize();
    // Electron.ipcRenderer.send('min');
    // const remote = require('electron').remote;
    // remote.getGlobal("mainWindow").minimize();
    // alert("hi")
  }
  const close = () => {
    // Electron.BrowserWindow.getFocusedWindow()?.close();
    // Electron.ipcRenderer.send('close');
  }
  const expand = () => {
    // Electron.BrowserWindow.getFocusedWindow()?.setFullScreen(true)
    // Electron.ipcRenderer.send('max');
  }
  return (
    <DragBar position="static">
      <Toolbar variant="dense" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Dragger>
          <Typography variant="h6" color="inherit" component="div">
            Functio-notes
          </Typography>
        </Dragger>
        <ButtonContainer>
          <RoundButton variant="contained" onClick={() => minimize()}>
            <MinimizeIcon></MinimizeIcon>
          </RoundButton>
          <RoundButton variant="contained" onClick={() => expand()}>
            <FullscreenIcon></FullscreenIcon>
          </RoundButton>
          <RoundButton variant="contained" onClick={() => close()}>
            <CloseIcon></CloseIcon>
          </RoundButton>
        </ButtonContainer>
      </Toolbar>
    </DragBar>
  )
}

export default Navbar