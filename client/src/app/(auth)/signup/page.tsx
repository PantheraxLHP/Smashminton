'use client';
import SignupForm from './SignupForm';

export default function SignUp() {
    return (
        <div className="min-h-screen bg-[url('https://res.cloudinary.com/dnagyxwcl/image/upload/v1747907677/signupbg_xl6dei.png')] bg-cover bg-center">
            <div className="flex min-h-screen items-center justify-center p-8">
                <SignupForm />
            </div>
        </div>
    );
}
