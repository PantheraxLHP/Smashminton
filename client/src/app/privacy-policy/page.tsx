import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto flex max-w-3xl justify-center px-4 py-10">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        Your privacy is important to us. Smashminton collects and uses your information only for
                        providing and improving our services. We do not share your personal data with third parties
                        except as required by law.
                    </p>
                    <p>For more details, please contact us or review our full privacy practices.</p>
                </CardContent>
            </Card>
        </div>
    );
}
