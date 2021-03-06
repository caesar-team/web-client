import React from 'react';
// eslint-disable-next-line
import { default as NextApp } from 'next/app';
import Head from 'next/head';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import globalStyles from '@caesar/assets/styles/globalStyles';
import theme from '@caesar/common/theme';
import withRedux from 'next-redux-wrapper';
import { configureWebStore } from '@caesar/common/root/store';
import { NotificationProvider } from '@caesar/components';

import {
  fixedSizeListener,
  fixedSizeUnListener,
} from '@caesar/common/utils/forceScreenSize';
import { PWA_WINDOW_SIZE } from '@caesar/common/constants';

const GlobalStyles = createGlobalStyle`${globalStyles}`;

class Application extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    // entryResolver({ route, ctx });

    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps(ctx)
      : {};

    return { pageProps };
  }

  componentDidMount() {
    fixedSizeListener(PWA_WINDOW_SIZE.width, PWA_WINDOW_SIZE.height);
  }

  componentWillUnmount() {
    fixedSizeUnListener();
  }

  componentDidCatch(error, errorInfo) {
    fixedSizeUnListener();
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <ThemeProvider theme={theme}>
          <NotificationProvider>
            <GlobalStyles />
            <Component {...pageProps} />
          </NotificationProvider>
        </ThemeProvider>
      </>
    );
  }
}

export default withRedux(configureWebStore)(Application);
