import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { theme } from 'theme';
import { DashlyApp } from 'views/dashly/DashlyApp';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <ChakraProvider theme={theme}>
      <React.StrictMode>
        <DashlyApp />
      </React.StrictMode>
    </ChakraProvider>
  );
}
