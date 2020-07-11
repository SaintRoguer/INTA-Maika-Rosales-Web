import "../css/main.css";
import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import Link from "next/link";
import withAuthUser from "../utils/pageWrappers/withAuthUser";
import withAuthUserInfo from "../utils/pageWrappers/withAuthUserInfo";
import Header from "../components/header";
import Footer from "../components/footer";
import Head from "next/head";
import Navbar from "../components/navbar";
import Table from "../pages/table";

const Index = (props: any) => {
  return (
    <div>
      <Head>
        <meta
          name="twitter:description"
          content="News content from the Tailwind CSS team."
        />

        <meta property="og:url" content="https://blog.tailwindcss.com" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="Blog – Tailwind CSS" />
        <meta
          property="og:description"
          content="News content from the Tailwind CSS team."
        />

        <title>Blog – Tailwind CSS</title>
      </Head>
      <Navbar />
      <Table />
    </div>
  );
};

export default Index;
