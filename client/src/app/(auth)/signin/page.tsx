import SignInForm from './SigninForm';

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-[url('https://res.cloudinary.com/dnagyxwcl/image/upload/v1747907584/loginbg_l2ss1n.jpg')] bg-cover bg-center">
            <div className="flex min-h-screen items-center justify-center p-8">
                <SignInForm />
            </div>
        </div>
    );
}
