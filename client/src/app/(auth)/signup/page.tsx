'use client';
import Image from 'next/image';
import SignupForm from './SignupForm';

export default function SignUp() {
    return (
        <div className={`flex min-h-screen flex-col bg-gray-200 transition-all duration-300`}>
            {/* Background section */}
            <div className="relative flex flex-1 items-center justify-center bg-black py-12">
                <Image
                    src="/signupbg.png"
                    alt="Background Image"
                    fill
                    priority
                    className="absolute inset-0 h-full w-full object-cover opacity-100"
                />

                <SignupForm />
            </div>
        </div>
    );
}
