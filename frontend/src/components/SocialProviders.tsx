import { signIn } from "@/lib/auth-client";
import { FaApple, FaGithub, FaGoogle } from "react-icons/fa";

const SocialProviders = () => {
  const handleGoogle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await signIn.social({
        provider: "google",
        callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
      });
    } catch (error) {
      console.error("Google sign in error:", error);
    }
  };

  const handleGithub = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await signIn.social({
        provider: "github",
        callbackURL: process.env.NEXT_PUBLIC_FRONTEND_URL,
      });
    } catch (error) {
      console.error("Github sign in error:", error);
    }
  };

  return (
    <div className="mt-6 w-full">
      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={handleGoogle}
          className="inline-flex w-full justify-center rounded-md border border-input bg-transparent px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:cursor-pointer text-body font-bevellier transition-colors"
        >
          <FaGoogle className="mr-2 h-5 w-5" />
          Continue with Google
        </button>
        <button
          type="button"
          onClick={handleGithub}
          className="inline-flex w-full justify-center rounded-md border border-input bg-transparent px-4 py-3 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:cursor-pointer text-body font-bevellier transition-colors"
        >
          <FaGithub className="mr-2 h-5 w-5" />
          Continue with Github
        </button>
      </div>

      <div className="relative mt-6 mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground text-body font-bevellier">
            Or continue with email
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialProviders;
