import AuthForm from '@/components/AuthForm';
import SocialProviders from '@/components/SocialProviders';
import Link from 'next/link';

const SignInPage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mb-8 self-end text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          Sign Up
        </Link>
      </div>
      <AuthForm type="sign-in" />
      <SocialProviders />
    </div>
  );
};

export default SignInPage;
