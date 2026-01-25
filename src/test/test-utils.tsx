import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PubKeyContext from '../utils/PubKeyContext';
import { ThemeProvider } from '../utils/ThemeContext';

// Default mock context values matching PubKeyContextType
const defaultContextValue = {
  pubKey: null as string | null,
  setPubKey: () => {},
  authenticated: false as boolean | null,
  setAuthenticated: () => {},
  setValidDemo: () => {},
  demo: false as boolean | null,
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  contextValue?: Partial<typeof defaultContextValue>;
  withRouter?: boolean;
}

/**
 * Custom render function that wraps components with necessary providers
 */
function customRender(
  ui: ReactElement,
  { contextValue = {}, withRouter = true, ...options }: CustomRenderOptions = {}
) {
  const mergedContext = { ...defaultContextValue, ...contextValue };

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const content = (
      <ThemeProvider>
        <PubKeyContext.Provider value={mergedContext}>{children}</PubKeyContext.Provider>
      </ThemeProvider>
    );

    return withRouter ? <BrowserRouter>{content}</BrowserRouter> : content;
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from testing-library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { userEvent } from '@testing-library/user-event';

// Override render with custom render
export { customRender as render };
