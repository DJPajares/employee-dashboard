import SideNav from '@/components/global/SideNav';
import TopBar from '@/components/global/Topbar';
import { ColorModeContext, useMode } from '../config/themes';
import '@/styles/globals.css';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ProSidebarProvider } from 'react-pro-sidebar';

function App({ Component, pageProps }: AppProps) {
  const { theme, colorMode } = useMode();

  return (
    <>
      <Head>
        <title>Employee Dashboard</title>
      </Head>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <ProSidebarProvider>
            <div className="app">
              <SideNav />
              <main className="content">
                <TopBar />
                <Component {...pageProps} />
              </main>
            </div>
          </ProSidebarProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;
