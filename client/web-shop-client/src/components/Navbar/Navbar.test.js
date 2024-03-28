import { render } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Navbar from './Navbar';
import { act } from 'react-dom/test-utils';

import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";


global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ rates: {id: 1}}),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

jest.mock('../../context/UserContext', () => ({
    useUser: () => { return {state : {}, dispatch: jest.fn()}}
}))

jest.mock('../../context/CartContext', () => ({
    useCart: () => { return {state: {cartItems: [
        {
            "id": 1,
            "product_id": 1,
            "quantity": 1,
            "created_at": "2024-03-27T17:53:23.000Z"
        },
        {
            "id": 2,
            "product_id": 2,
            "quantity": 2,
            "created_at": "2024-03-27T17:53:23.000Z"
        }
    ]}, dispatch: jest.fn()}}
}))

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
    act(() => {
        const { container } = render(<Navbar />)
        expect(container).toMatchSnapshot()
    });
})
