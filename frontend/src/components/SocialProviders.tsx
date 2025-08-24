import { Chrome, Apple } from 'lucide-react';

const SocialProviders = () => {
  return (
    <div className="mt-6 w-full">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">
            Or sign up with
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          // onClick={() => signIn('google')}
          className="inline-flex w-full justify-center rounded-md border border-input bg-transparent px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
        >
          <Chrome className="mr-2 h-5 w-5" />
          Continue with Google
        </button>
        <button
          // onClick={() => signIn('apple')}
          className="inline-flex w-full justify-center rounded-md border border-input bg-transparent px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
        >
          <Apple className="mr-2 h-5 w-5" />
          Continue with Apple
        </button>
      </div>
    </div>
  );
};

export default SocialProviders;
