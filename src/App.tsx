import logo from './logo.svg';
import './App.css';
import Navbar from './Editor/Common/Navbar';
import { createTheme, ThemeProvider } from '@mui/material';
import EditorApp from './Editor/EditorApp';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={ darkTheme }>
      <EditorApp />
    </ThemeProvider>
  );
}

export default App;
