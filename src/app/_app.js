import React from 'react';
import RootLayout from './layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
    return (
        <RootLayout>
            <Component {...pageProps} />
        </RootLayout>

    );
};
