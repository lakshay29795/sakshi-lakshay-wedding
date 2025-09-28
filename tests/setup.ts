import '@testing-library/jest-dom';
import React from 'react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef((props: any, ref: any) => 
      React.createElement('div', { ...props, ref }, props.children)
    ),
    section: React.forwardRef((props: any, ref: any) => 
      React.createElement('section', { ...props, ref }, props.children)
    ),
    button: React.forwardRef((props: any, ref: any) => 
      React.createElement('button', { ...props, ref }, props.children)
    ),
    img: React.forwardRef((props: any, ref: any) => 
      React.createElement('img', { ...props, ref }, props.children)
    ),
  },
  AnimatePresence: ({ children }: any) => children,
  useInView: () => true,
  useAnimation: () => ({
    start: jest.fn(),
    set: jest.fn(),
  }),
}));

// Jest globals
declare global {
  var beforeAll: (fn: () => void) => void;
  var afterAll: (fn: () => void) => void;
}

// Mock IntersectionObserver
Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  value: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

// Mock ResizeObserver
Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  value: class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
});

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('React does not recognize') ||
       args[0].includes('Received `true` for a non-boolean attribute'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});