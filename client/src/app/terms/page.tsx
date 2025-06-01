import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TermsPage() {
    return (
        <div className="container mx-auto flex max-w-3xl justify-center px-4 py-10">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Terms and Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        By using Smashminton, you agree to our terms and conditions. Please use the platform responsibly
                        and respect other users.
                    </p>
                    <p>
                        We reserve the right to update these terms at any time. Continued use of the service constitutes
                        acceptance of the new terms.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
