import { get, set } from "local-storage";
import { v4 as uuid } from 'uuid';
import { defaultContent } from "./default";

export type FileStateParams = { openFile: File, setFiles: React.Dispatch<File[]>, setOpenFile: React.Dispatch<File>, files: File[] }

export type File = {
  key: string,
  title: string,
  contentPreview?: string,
  content: string,
  lastUpdated?: string
}

const fileStore = [
  {
    key: "Welcome!",
    title: "Welcome!",
    contentPreview: "A slightly more functional notes app... in some ways.",
    content: defaultContent.replaceAll('\n', '\r\n')
  }
]

const extractTitle = (line: string) => {
  const replaced = line.replace('#', '')
  console.log(line, replaced)
  return replaced.trim()
}

export class FileProvider {
  public static Files: File[] = [];
  public static GetFiles(): File[] {
    const storedText = get<File[]>("notes-storage");
    if (!storedText || storedText.length === 0) {
      set("notes-storage", fileStore)
      FileProvider.Files = fileStore
      console.log(fileStore)
      return fileStore
    }
    FileProvider.Files = fileStore
    return storedText
  }
  public static DeleteFile(key: string) {
    const files = FileProvider.GetFiles();
    const fileIndex = files.findIndex(file => file.key == key)
    if (fileIndex > -1) files.splice(fileIndex, 1)
    FileProvider.Files = files
    set("notes-storage", files)
  }
  public static UpdateFile(key: string, content: string) {
    const files = FileProvider.GetFiles();
    const file = files.find(file => file.key == key)
    console.log('updating file: ', key)
    if (file) {
      file.content = content
      const lines = content.split('\r\n')
      // console.log(lines)
      if (lines[0]) file.title = extractTitle(lines[0])
      if (lines[1]) file.contentPreview = lines[1]
      file.lastUpdated = new Date().toString()
    }
    // console.log('saving', file)
    FileProvider.Files = files
    set("notes-storage", files)
  }
  public static CreateFile() {
    const file: File = {
      key: uuid(),
      title: "New File",
      contentPreview: "",
      content: "",
      lastUpdated: new Date().toString()
    }
    const files = FileProvider.GetFiles();
    files.push(file)
    set("notes-storage", files)
    // console.log(files)
    return file
  }
}