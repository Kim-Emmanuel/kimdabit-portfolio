import { render as rtlRender } from '@testing-library/react';
import { ReactElement } from 'react';
import userEvent from '@testing-library/user-event';

// Add in any providers here if needed
const Providers = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (ui: ReactElement, options = {}) => {
  const returnValue = {
    ...rtlRender(ui, { wrapper: Providers, ...options }),
    user: userEvent.setup()
  };
  return returnValue;
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

// Add a test to satisfy Jest's requirement
describe('test-utils', () => {
  it('provides custom render method', () => {
    expect(customRender).toBeDefined();
  });
});
