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
import Router from "next/router";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { esES } from '@mui/material/locale';

import PageChange from "components/PageChange/PageChange.js";

import "assets/css/nextjs-material-dashboard.css?v=1.0.0";
import { SWRConfig } from "swr";

const theme = createTheme();

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  render() {
    const { Component, pageProps } = this.props;

    const Layout = Component.layout || (({ children }) => <>{children}</>);

    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <title>CGS - Cobertura y gestión de suelos</title>
        </Head>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={createTheme(theme,esES)}>

          <SWRConfig
            value={{
              fetcher: async (...args) => {
                const res = await fetch(...args);
                return res.json();
              },
            }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SWRConfig>
          </ThemeProvider>
        </StyledEngineProvider>
      </React.Fragment>
    );
  }
}
