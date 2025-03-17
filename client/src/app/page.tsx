import { LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl text-black">Welcome to Smashminton !!!</h1>
      <LinkIcon name="link" className="mr-2 inline-block" />
      <Link href="/signin" className="hover:text-yellow-500 hover:underline">
        Go to signin
      </Link>
    </div>
  );
}
