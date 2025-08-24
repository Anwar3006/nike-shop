import AuthForm from '@/components/AuthForm';
import SocialProviders from '@/components/SocialProviders';
import Link from 'next/link';

const SignInPage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <AuthForm type="sign-in" />
      <SocialProviders />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don’t have an account?{' '}
        <Link href="/sign-up" className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;
