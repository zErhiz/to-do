import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { Layout } from "@/components/layout";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      signInForceRedirectUrl="/notes"
      signUpForceRedirectUrl="/notes"
      afterSignOutUrl="/"
      {...pageProps}
    >
      <Layout>
        {" "}
        <Component {...pageProps} />{" "}
      </Layout>
    </ClerkProvider>
  );
}
