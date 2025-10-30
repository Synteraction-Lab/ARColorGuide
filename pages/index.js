import Head from 'next/head';
import App from '../src/App';

export default function Home() {
  return (
    <>
      <Head>
        <title>AR Color Selection Guidelines</title>
        <meta name="description" content="AR Color Selection Guidelines - Interactive Research Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <App />
    </>
  );
} 