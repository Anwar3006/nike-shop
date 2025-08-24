import AuthForm from '@/components/AuthForm';
import SocialProviders from '@/components/SocialProviders';
import Link from 'next/link';

const SignUpPage = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <AuthForm type="sign-up" />
      <SocialProviders />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignUpPage;
