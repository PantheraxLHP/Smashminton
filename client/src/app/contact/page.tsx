import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ContactPage() {
    return (
        <div className="container mx-auto flex max-w-3xl justify-center px-4 py-10">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Have questions or need support? Reach out to us:</p>
                    <ul className="list-disc pl-6">
                        <li>Email: support@smashminton.com</li>
                        <li>Phone: +1 (555) 123-4567</li>
                    </ul>
                    <p>We aim to respond to all inquiries within 2 business days.</p>
                </CardContent>
            </Card>
        </div>
    );
}
