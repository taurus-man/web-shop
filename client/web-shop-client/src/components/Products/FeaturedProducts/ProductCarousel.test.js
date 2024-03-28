import { render } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ProductCarousel from './ProductCarousel'
import { act } from 'react-test-renderer';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ rates: {id: 1}}),
  })
);

jest.spyOn(console, 'error').mockImplementation(jest.fn());


beforeEach(() => {
  fetch.mockClear();
});

// Mock useRouter:
jest.mock("next/navigation", () => ({
    useRouter() {
      return {
        prefetch: () => null
      };
    }
  }));

 
it('renders correctly', () => {
    act(() => {
        const { container } = render(<ProductCarousel />)
        expect(container).toMatchSnapshot()
      })
});
