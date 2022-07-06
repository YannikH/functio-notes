import { DriveFileRenameOutline, VerticalSplit, Visibility, MoreVert } from "@mui/icons-material"
import { AppBar, Box, ButtonGroup, IconButton, Menu, MenuItem, Toolbar } from "@mui/material"
import React, { useState } from "react";
import { FileProvider, FileStateParams } from "../Util/FileProvider";
import { ButtonDark } from "../Util/StyledComponents"


const CommandBar = ({viewMode, setViewMode, openFile, setOpenFile, setFiles}: {viewMode: number, setViewMode: React.Dispatch<number>} & FileStateParams) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open)
  };
  const handleClose = () => {
    setOpen(false)
    setAnchorEl(null)
  }
  const deleteFile = () => {
    FileProvider.DeleteFile(openFile.key)
    const files = FileProvider.GetFiles()
    setOpenFile(files[0])
    setFiles(files)
    setOpen(false)
  }
  return (
    <>
      <AppBar position="relative">
        <Toolbar variant="dense" style={{ display: 'flex', justifyContent: 'space-between' }}>
          Toolbar
          <Box style={{ display: 'flex' , alignItems: 'center' }}>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <ButtonDark variant="contained" onClick={() => setViewMode(0)}><DriveFileRenameOutline/></ButtonDark>
              <ButtonDark variant="contained" onClick={() => setViewMode(1)}><VerticalSplit/></ButtonDark>
              <ButtonDark variant="contained" onClick={() => setViewMode(2)}><Visibility/></ButtonDark>
            </ButtonGroup>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVert />
            </IconButton>
            <Menu
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              >
              <MenuItem onClick={deleteFile}>Delete File</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default CommandBar