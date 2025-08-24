import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl font-bold">Welcome</h1>
      <div className="flex gap-4">
        <Link href="/sign-in" className="rounded-lg bg-primary px-6 py-3 text-primary-foreground">
          Sign In
        </Link>
        <Link href="/sign-up" className="rounded-lg bg-secondary px-6 py-3 text-secondary-foreground">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
