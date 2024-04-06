import React from 'react';
import RootLayout from './layout';
import '../styles/globals.css';
import RootStoreProvider from '@/providers/rootStoreProvider';

export default function App({ Component, pageProps }) {
    return (
        <RootStoreProvider>
            <RootLayout>
                <Component {...pageProps} />
            </RootLayout>
        </RootStoreProvider>
    );
};
