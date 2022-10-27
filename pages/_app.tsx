import * as React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";

import { store } from "@/store/store";
import { NextUIProvider } from "@nextui-org/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CookiesProvider>
        <NextUIProvider>
          <Component {...pageProps} />
        </NextUIProvider>
      </CookiesProvider>
    </Provider>
  );
}

export default MyApp;
