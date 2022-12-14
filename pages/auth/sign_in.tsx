import { NextPage } from "next";
import Head from "next/head";

import SignIn from "@/components/pages/SignIn";

const SignInPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>TMP - Sign In</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignIn />
    </>
  );
};

export default SignInPage;
