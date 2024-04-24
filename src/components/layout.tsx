import Head from "next/head";

import { useRouter } from "next/router";
import Link from "next/link";
import { Nav } from "./nav";
export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>To-Do list</title>
        <meta
          name="description"
          content="A To-Do List website is a digital platform designed to help users organize and manage tasks, assignments, or activities."
        />
        <meta name="theme-color" content="#5B21B6" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Nav />
      <main className="flex h-full min-h-screen flex-col items-center bg-gradient-to-b from-blue-500 to-white">
        {children}
      </main>

      <footer className="relative flex h-fit bg-blue-800 py-3">
        <div className="container flex h-full flex-col items-center justify-center">
          <h2 className="text-white font-semibold">
            Made with{" "}
            <span role="img" aria-label="heart">
              ❤️
            </span>{" "}
            by <a href="https://github.com/zErhiz">Mateo</a>
          </h2>
        </div>
      </footer>
    </>
  );
}
