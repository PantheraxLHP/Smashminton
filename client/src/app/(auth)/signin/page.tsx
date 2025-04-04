import Image from 'next/image';
import SignInForm from './SigninForm';

export default function SignInPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gray-200">
            <div className="relative flex flex-1 items-center justify-center bg-black">
                <Image
                    src="/loginbg.png"
                    alt="Badminton"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="absolute inset-0 h-full w-full object-cover opacity-100"
                />

                <SignInForm />
            </div>
        </div>
    );
}
