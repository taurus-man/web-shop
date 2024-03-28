import { render } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import ImageCarousel from './ImageCarousel';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ rates: {id: 1}}),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

jest.spyOn(console, 'error').mockImplementation(jest.fn());

// Mock useRouter:
jest.mock("next/navigation", () => ({
    useRouter() {
      return {
        prefetch: () => null
      };
    }
  }));

 
it('renders correctly', () => {
  const { container } = render(<ImageCarousel />)
  expect(container).toMatchSnapshot()
})
