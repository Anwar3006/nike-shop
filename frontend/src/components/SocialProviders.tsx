import { Chrome, Apple } from 'lucide-react';

const SocialProviders = () => {
  return (
    <div className="mt-6 w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div>
          <button
            // onClick={() => signIn('google')}
            className="inline-flex w-full justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Google
          </button>
        </div>

        <div>
          <button
            // onClick={() => signIn('apple')}
            className="inline-flex w-full justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent"
          >
            <Apple className="mr-2 h-5 w-5" />
            Apple
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialProviders;
