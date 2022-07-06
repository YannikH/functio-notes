import { get, set } from "local-storage";
import { v4 as uuid } from 'uuid';

export type File = {
  key: string,
  title: string,
  contentPreview?: string,
  content: string,
  lastUpdated?: string
}

const fileStore = [
  {
    key: "asdfdfsasf",
    title: "Test test test",
    contentPreview: "aslkdjfadslkjffa",
    content: "asdflkad"
  }
]
function getFormattedDate() {
  var date = new Date();
  var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return str;
}

export class FileProvider {
  public static Files: File[] = [];
  public static GetFiles(): File[] {
    const storedText = get<File[]>("notes-storage");
    if (!storedText) {
      set("notes-storage", fileStore)
      FileProvider.Files = fileStore
      return fileStore
    }
    FileProvider.Files = fileStore
    return storedText
  }
  public static UpdateFile(key: string, content: string) {
    const files = FileProvider.GetFiles();
    const file = files.find(file => file.key == key)
    if (file) {
      file.content = content
      const lines = content.split('\r\n')
      // console.log(lines)
      if (lines[0]) file.title = lines[0]
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