import ResetPasswordForm from './ResetPasswordForm';

interface ResetPasswordPageProps {
    params: Promise<{
        token: string;
    }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
    const { token } = await params;

    return (
        <div className="min-h-screen bg-[url('https://res.cloudinary.com/dnagyxwcl/image/upload/v1747907584/loginbg_l2ss1n.jpg')] bg-cover bg-center">
            <div className="flex min-h-screen items-center justify-center">
                <ResetPasswordForm token={token} />
            </div>
        </div>
    );
}
