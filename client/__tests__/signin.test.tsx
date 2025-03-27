import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SignInPage from '../src/app/(auth)/signin/page';

// Mock Next.js components and hooks
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={props.src} alt={props.alt} {...props} />;
    },
}));

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: { children: React.ReactNode; href: string }) => {
        return <a href={href}>{children}</a>;
    },
}));

// Mock fetch API
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock window.location
const mockLocation = {
    href: '',
};
Object.defineProperty(window, 'location', {
    value: mockLocation,
    writable: true,
});

describe('SignInPage Component', () => {
    beforeEach(() => {
        // Reset mocks before each test
        mockFetch.mockReset();
        mockLocalStorage.setItem.mockReset();
        mockLocation.href = '';
    });

    test('renders sign-in form correctly', () => {
        render(<SignInPage />);

        // Check if important elements are rendered
        expect(screen.getByText('Đăng nhập')).toBeInTheDocument();
        expect(screen.getByLabelText(/Nhập số điện thoại/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Nhập mật khẩu/i)).toBeInTheDocument();
        expect(screen.getByText('ĐĂNG NHẬP')).toBeInTheDocument();
        expect(screen.getByText(/Quên mật khẩu?/i)).toBeInTheDocument();
        expect(screen.getByText(/Bạn chưa có tài khoản?/i)).toBeInTheDocument();
        expect(screen.getByText('Đăng ký ngay')).toBeInTheDocument();
    });

    test('allows user to enter phone number and password', async () => {
        render(<SignInPage />);

        const phoneInput = screen.getByLabelText(/Nhập số điện thoại/i);
        const passwordInput = screen.getByLabelText(/Nhập mật khẩu/i);

        await userEvent.type(phoneInput, '0123456789');
        await userEvent.type(passwordInput, 'password123');

        expect(phoneInput).toHaveValue('0123456789');
        expect(passwordInput).toHaveValue('password123');
    });

    test('submits the form and handles successful login', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: 'fake-token' }),
        });

        render(<SignInPage />);

        const phoneInput = screen.getByLabelText(/Nhập số điện thoại/i);
        const passwordInput = screen.getByLabelText(/Nhập mật khẩu/i);
        const submitButton = screen.getByText('ĐĂNG NHẬP');

        await userEvent.type(phoneInput, '0123456789');
        await userEvent.type(passwordInput, 'password123');
        fireEvent.click(submitButton);

        await waitFor(() => {
            // Check if fetch was called with correct parameters
            expect(mockFetch).toHaveBeenCalledWith('http://localhost:5555/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: '0123456789', password: 'password123' }),
            });

            // Check if token was saved to localStorage
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');

            // Check if redirect happened
            expect(mockLocation.href).toBe('/home');
        });
    });

    test('displays error message on login failure', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: 'Số điện thoại hoặc mật khẩu không chính xác' }),
        });

        render(<SignInPage />);

        const phoneInput = screen.getByLabelText(/Nhập số điện thoại/i);
        const passwordInput = screen.getByLabelText(/Nhập mật khẩu/i);
        const submitButton = screen.getByText('ĐĂNG NHẬP');

        await userEvent.type(phoneInput, '0123456789');
        await userEvent.type(passwordInput, 'wrong-password');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Số điện thoại hoặc mật khẩu không chính xác')).toBeInTheDocument();
            expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
            expect(mockLocation.href).not.toBe('/home');
        });
    });

    test('handles network error during login', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network Error'));

        render(<SignInPage />);

        const phoneInput = screen.getByLabelText(/Nhập số điện thoại/i);
        const passwordInput = screen.getByLabelText(/Nhập mật khẩu/i);
        const submitButton = screen.getByText('ĐĂNG NHẬP');

        await userEvent.type(phoneInput, '0123456789');
        await userEvent.type(passwordInput, 'password123');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Lỗi kết nối đến server')).toBeInTheDocument();
        });
    });

    test('signup link points to correct route', () => {
        render(<SignInPage />);

        const signupLink = screen.getByText('Đăng ký ngay');
        expect(signupLink).toHaveAttribute('href', '/signup');
    });
});
