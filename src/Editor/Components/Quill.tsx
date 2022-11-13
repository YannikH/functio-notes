import ReactQuill from "react-quill"
import { FileStateParams } from "../Util/FileProvider"

const RichEditor = ({ openFile, setFiles, setOpenFile, files }: FileStateParams) => {
  return (<>
    <ReactQuill theme="snow" style={{ height: '100%', flexGrow: '1', backgroundColor: 'white' }} />
  </>)
}

export default RichEditor