import AuthForm from '@/components/AuthForm';
import SocialProviders from '@/components/SocialProviders';
import Link from 'next/link';

const SignUpPage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="mb-8 self-end text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </div>
      <AuthForm type="sign-up" />
      <SocialProviders />
      <p className="mt-8 text-center text-xs text-muted-foreground">
        By signing up, you agree to our{' '}
        <Link href="#" className="underline hover:text-primary">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" className="underline hover:text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default SignUpPage;
