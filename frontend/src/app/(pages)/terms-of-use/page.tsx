import React from "react";

const TermsOfUse = () => {
  return (
    <div className="bg-white text-black font-bevellier">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Terms of Use</h1>
          <div className="space-y-6 text-gray-700">
            <p>
              Welcome to the Nike Shop. These Terms of Use (&quot;Terms&quot;) govern your
              access to and use of our website, products, and services (collectively,
              the &quot;Services&quot;). Please read these Terms carefully before using our
              Services.
            </p>
            <h2 className="text-2xl font-semibold mt-6">1. Acceptance of Terms</h2>
            <p>
              By accessing or using our Services, you agree to be bound by these
              Terms and our Privacy Policy. If you do not agree to these Terms, you
              may not use our Services.
            </p>
            <h2 className="text-2xl font-semibold mt-6">2. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. We will notify you of any
              changes by posting the new Terms on this page. Your continued use of
              the Services after the changes have been posted will constitute your
              acceptance of the new Terms.
            </p>
            <h2 className="text-2xl font-semibold mt-6">3. Use of Services</h2>
            <p>
              You may use our Services only for lawful purposes and in accordance
              with these Terms. You agree not to use our Services:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                In any way that violates any applicable federal, state, local, or
                international law or regulation.
              </li>
              <li>
                To engage in any conduct that restricts or inhibits anyone&apos;s use
                or enjoyment of the Services, or which, as determined by us, may
                harm us or users of the Services.
              </li>
              <li>
                To impersonate or attempt to impersonate Nike, a Nike employee,
                another user, or any other person or entity.
              </li>
            </ul>
            <h2 className="text-2xl font-semibold mt-6">4. Intellectual Property</h2>
            <p>
              The Services and their entire contents, features, and functionality
              (including but not limited to all information, software, text,
              displays, images, video, and audio, and the design, selection, and
              arrangement thereof) are owned by Nike, its licensors, or other
              providers of such material and are protected by United States and
              international copyright, trademark, patent, trade secret, and other
              intellectual property or proprietary rights laws.
            </p>
            <h2 className="text-2xl font-semibold mt-6">5. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:support@nike.com" className="text-blue-600 hover:underline">
                support@nike.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
