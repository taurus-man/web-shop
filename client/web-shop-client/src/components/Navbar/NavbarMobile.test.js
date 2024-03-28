import { render } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import NavbarMobile from './NavbarMobile';
import { UserProvider } from '@/context/UserContext';
import { CartProvider } from '@/context/CartContext';
import { act } from 'react-dom/test-utils';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ rates: {id: 1}}),
  })
);

jest.spyOn(console, 'error').mockImplementation(jest.fn());


beforeEach(() => {
  fetch.mockClear();
  jest.clearAllMocks();
});

// Mock useRouter:
jest.mock("next/navigation", () => ({
    usePathname(){
        return '/signin'
    },
    useRouter() {
      return {
        prefetch: () => null
      };
    }
  }));

 
it('renders correctly', () => {
    act(() => {
        const { container } = render(<UserProvider><CartProvider><NavbarMobile /></CartProvider></UserProvider>)
        expect(container).toMatchSnapshot()
    });
})
