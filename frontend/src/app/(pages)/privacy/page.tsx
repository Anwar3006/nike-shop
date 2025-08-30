import React from "react";

const PrivacyPage = () => {
  return (
    <div className="bg-white text-black font-bevellier">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Privacy Policy
          </h1>
          <div className="space-y-6 text-gray-700 text-center">
            <p>
              Your privacy is important to us. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you
              visit our website.
            </p>
            <h2 className="text-2xl font-semibold mt-6">
              1. Collection of Your Information
            </h2>
            <p>
              We may collect information about you in a variety of ways. The
              information we may collect on the Site includes:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Personal Data:</strong> Personally identifiable
                information, such as your name, shipping address, email address,
                and telephone number, and demographic information, such as your
                age, gender, hometown, and interests, that you voluntarily give
                to us when you register with the Site or when you choose to
                participate in various activities related to the Site, such as
                online chat and message boards.
              </li>
              <li>
                <strong>Derivative Data:</strong> Information our servers
                automatically collect when you access the Site, such as your IP
                address, your browser type, your operating system, your access
                times, and the pages you have viewed directly before and after
                accessing the Site.
              </li>
            </ul>
            <h2 className="text-2xl font-semibold mt-6">
              2. Use of Your Information
            </h2>
            <p>
              Having accurate information about you permits us to provide you
              with a smooth, efficient, and customized experience. Specifically,
              we may use information collected about you via the Site to:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Create and manage your account.</li>
              <li>Email you regarding your account or order.</li>
              <li>
                Fulfill and manage purchases, orders, payments, and other
                transactions related to the Site.
              </li>
              <li>Improve our products and services.</li>
            </ul>
            <h2 className="text-2xl font-semibold mt-6">3. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:privacy@nike.com"
                className="text-blue-600 hover:underline"
              >
                privacy@nike.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
