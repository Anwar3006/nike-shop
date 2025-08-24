import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-black p-12 text-white">
        <div className="text-2xl font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-heading-2 font-bevellier">
            Just Do It
          </h1>
          <p className="mt-4 text-lead font-bevellier text-gray-400">
            Join millions of athletes and fitness enthusiasts who trust Nike for
            their performance needs.
          </p>
        </div>
        <p className="text-sm text-gray-500 text-footnote font-bevellier">
          © {new Date().getFullYear()} Nike. All rights reserved.
        </p>
      </div>
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
