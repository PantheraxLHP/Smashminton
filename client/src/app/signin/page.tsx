import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div>
      <h1>Sign In Page</h1>
      <Button asChild>
        <Link href="/sigout">Signout</Link>
      </Button>
    </div>
  );
}
