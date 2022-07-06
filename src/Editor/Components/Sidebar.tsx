import { Box, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import styled, { isStyledComponent } from "styled-components";
import { FileProvider, File, FileStateParams } from "../Util/FileProvider"
import { ButtonLight } from "../Util/StyledComponents";
import { DragDropContext } from 'react-beautiful-dnd';

const CardBackground = styled.div`
  width: 300px;
  padding: 5px 15px 5px 5px;
  /* background-color: #3c3c3c; */
  border: solid 1px #3c3c3c;
  border-radius: 4px;
  margin: 3px;
  cursor: pointer;
  -webkit-box-shadow: inset -8px 10px 36px -25px rgba(0,0,0,0.73);
  -moz-box-shadow: inset -8px 10px 36px -25px rgba(0,0,0,0.73);
  box-shadow: inset -8px 10px 36px -25px rgba(0,0,0,0.73);
`;

const isToday = (date: Date) => {
  const today = new Date()
  return date.getDate() == today.getDate() &&
    date.getMonth() == today.getMonth() &&
    date.getFullYear() == today.getFullYear()
}

const SidebarTitle = styled.h1`
  font-size: 1em;
`;

const FileCard = ({file, openFile, setOpenFile}: {file: File, openFile: File, setOpenFile: React.Dispatch<File>}) => {
  const onClick = () => {
    console.log('opening file', file.key)
    setOpenFile(file);
  }
  let timestamp = "";
  const lastUpdate = (file.lastUpdated) ? new Date(file.lastUpdated) : new Date();
  if (isToday(lastUpdate)) {
    timestamp = `${lastUpdate.getHours()}:${lastUpdate.getMinutes()}`;
  } else {
    timestamp = lastUpdate.toDateString()
  }
  const bgColor = (file.key === openFile.key) ? "rgb(80 76 54)" : "rgba(0,0,0,0)"
  const subtitleLine = `${timestamp} ${file.contentPreview}`
  return (
    <CardBackground onClick={() => onClick()} style={{ backgroundColor: bgColor }}>
      <SidebarTitle>{file.title.slice(0,35)}</SidebarTitle>
      <Typography variant="body2">{ subtitleLine.slice(0,45) }</Typography>
    </CardBackground>
  );
}

const CreateFileButton = ({ setOpenFile, setFiles }: { setOpenFile: React.Dispatch<File>, setFiles: React.Dispatch<File[]> }) => {
  const onClick = () => {
    console.log('Create clicked')
    setOpenFile(FileProvider.CreateFile());
    setFiles(FileProvider.GetFiles())
  }
  return (
    <ButtonLight variant="contained" style={{ flex: '0 1', margin: '0px 3px' }} onClick={() => onClick()}>New File</ButtonLight>
  );
}

const Sidebar = ({ openFile, setOpenFile, files, setFiles }: FileStateParams) => {
  useEffect(() => {
    console.log('===========files updated===========')
  }, [files])
  const fileList = files.map(file => <FileCard {...{file, setOpenFile, openFile}} />)
  return (
    <Box style={{ display: 'flex', flexDirection: 'column' }}>
      <CreateFileButton {...{setOpenFile, setFiles}} />
      { fileList }
    </Box>
  )
}

export default Sidebar