import type { NextPage } from "next";
import Head from "next/head";

import Home from "@/components/pages/Home";

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TMP - Admin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home />
    </>
  );
};

export default HomePage;
