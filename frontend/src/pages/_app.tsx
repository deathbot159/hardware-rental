import '@/Styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.css'
import type {AppProps} from 'next/app'
import Head from "next/head";
import AlertProvider from "@/Context/AlertProvider";
import LoaderProvider from "@/Context/LoaderProvider";
import SessionProvider from "@/Context/SessionProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LoaderProvider>
      <SessionProvider>
        <AlertProvider>
          <Head>
            <meta name="description" content="A simple page to rent an hardware :')" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Component {...pageProps} />
        </AlertProvider>
      </SessionProvider>
    </LoaderProvider>
  );
}
