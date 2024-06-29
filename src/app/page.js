import AdminPanelMain from './AdminPanel/page'
import LoginPage from './Login/LoginPage'

import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; 

export default function Home() {
  
  return (
    <main>
      <ThemeProvider theme={theme}>
        <LoginPage/>
      </ThemeProvider>
    </main>
  );
}
