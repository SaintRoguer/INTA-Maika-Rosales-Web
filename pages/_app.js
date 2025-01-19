/*!

=========================================================
* NextJS Material Dashboard v1.0.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import App from "next/app";
import Head from "next/head";
import { SWRConfig } from "swr";
import CssBaseline from "@mui/material/CssBaseline";

import { MaterialUIControllerProvider, useMaterialUIController } from "context";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { ThemeProvider } from "@mui/material/styles";
const MyApp = ({ Component, pageProps }) => {
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Cobertura y gestión de suelos</title>
        <link rel="shortcut icon" href="/favicon.png" />
        {/*href={require("assets/img/favicon.png")}*/}
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
            <CssBaseline />
            <Component {...pageProps} />
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
