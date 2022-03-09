import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {Redirect} from '@docusaurus/router';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return <Redirect to={useBaseUrl('/docs/Getting%20Started/installation')}/>;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header>
        <img
          style={{ height: "85vh" }}
          src={useBaseUrl("/img/landing/header.jpg")}
          alt="Logo"
        />
      </header>
    </Layout>
  );
}
