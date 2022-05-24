import { useState } from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import {
  MantineProvider,
  ColorScheme,
  ColorSchemeProvider,
  Global,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useHotkeys, useLocalStorage, useColorScheme } from "@mantine/hooks";
import Script from "next/script";

type SelectedColorScheme = ColorScheme | "system";

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useLocalStorage<SelectedColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: props.colorScheme,
    getInitialValueInEffect: true,
  });

  const systemColorScheme = useColorScheme();
  const selectedColorScheme: ColorScheme =
    colorScheme === "system" ? systemColorScheme : colorScheme;

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (selectedColorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
  };

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <>
      <Head>
        <title>ev:range v2</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-8JBSMD0WCV"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-8JBSMD0WCV');
        `}
      </Script>
      <ColorSchemeProvider
        colorScheme={selectedColorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme: selectedColorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <NotificationsProvider>
            <Global
              styles={(theme) => ({
                "*, *::before, *::after": {
                  boxSizing: "border-box",
                },
                body: {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[7]
                      : "#f2f2f2",
                  color:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[0]
                      : theme.black,
                },
              })}
            />
            <Component {...pageProps} />
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
