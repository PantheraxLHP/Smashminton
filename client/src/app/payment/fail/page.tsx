'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentFailPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white px-6 py-8 text-center shadow-md">
                <div className="mb-6">
                    <XCircle className="mx-auto h-16 w-16 text-red-500" />
                </div>
                <h1 className="mb-4 text-2xl font-bold text-gray-900">Payment Unsuccessful</h1>
                <p className="mb-8 text-gray-600">
                    We were unable to process your payment. This could be due to insufficient funds, incorrect card
                    details, or a temporary issue.
                </p>
                <div className="space-y-4">
                    <Link
                        href="/payment"
                        className="block w-full rounded-md bg-red-600 px-4 py-3 font-semibold text-white transition duration-200 hover:bg-red-700"
                    >
                        Try Again
                    </Link>
                    <Link
                        href="/"
                        className="block w-full rounded-md bg-gray-200 px-4 py-3 font-semibold text-gray-800 transition duration-200 hover:bg-gray-300"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
