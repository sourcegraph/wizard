import { useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();
  const onNextClick = useCallback((e) => {
    e.preventDefault();
    router.replace('/');
  }, []);

  return (
    <div className="container" role="main">
      <Head>
        <title>Sourcegraph Setup Wizard</title>
        <meta name="description" content="Set up a Sourcegraph instance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="homepage" role="main">
        <img alt="sourcegraph logo" src="/logo.svg" className="logo-big" />
        <h1>Sourcegraph Image Instance Setup Wizard</h1>
        <div className="settings">
          <h3 className="w-100">
            Let's start with some simple configurations while your instance is
            being set up in the background!
          </h3>
          <div className="m-5">
            <a href="#" onClick={(e) => onNextClick(e)}>
              <button className="btn-next">NEXT: Configuration</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
