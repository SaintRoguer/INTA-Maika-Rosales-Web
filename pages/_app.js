import React from "react";
import App from "next/app";
import Head from "next/head";
import { SWRConfig } from "swr";
import CssBaseline from "@mui/material/CssBaseline";

import { MaterialUIControllerProvider, useMaterialUIController } from "context";
import { ModalProvider } from 'context/ModalContext';
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { ThemeProvider } from "@mui/material/styles";

const MyApp = ({ Component, pageProps }) => {
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Cobertura y gestión de suelos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SWRConfig
        value={{
          fetcher: async (...args) => {
            const res = await fetch(...args);
            return res.json();
          },
        }}
      >
        <Layout>
          <ThemeProvider theme={darkMode ? themeDark : theme}>
            <ModalProvider>
              <CssBaseline />
              <Component {...pageProps} />
            </ModalProvider>
          </ThemeProvider>
        </Layout>
      </SWRConfig>
    </React.Fragment>
  );
};

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

function AppWrapper(props) {
  return (
    <MaterialUIControllerProvider>
      <MyApp {...props} />
    </MaterialUIControllerProvider>
  );
}

export default AppWrapper;