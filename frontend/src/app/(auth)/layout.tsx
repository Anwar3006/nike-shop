import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-black p-12 text-white">
        {/* Logo */}
        <div className="bg-gradient-to-br from-white to-gray-400 rounded-2xl p-2 w-12 h-12">
          <Image
            src="/logo-black.svg"
            alt="Logo"
            width={40} // Adjust based on your needs
            height={40} // Adjust based on your needs
            className="w-full h-full object-contain"
          />
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
