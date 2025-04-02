import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { render } from '@testing-library/react';
import React from 'react';
import type { ReactNode } from 'react';

type ProvidersProps = {
  children: ReactNode;
};

const AllTheProviders = ({ children }: ProvidersProps) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

const customRender = (ui: React.ReactElement, options = {}) => {
  return render(ui, { wrapper: AllTheProviders, ...options });
};

export * from '@testing-library/react';
export { customRender as render }; 