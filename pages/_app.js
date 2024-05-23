import React from "react";
import "semantic-ui-css/semantic.min.css";
import Layout from "../components/Layout";

function Kickstart({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default Kickstart;
