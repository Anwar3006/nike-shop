import React from "react";

const Guides = () => {
  return (
    <div className="bg-white text-black font-bevellier">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Guides</h1>
          <div className="space-y-6 text-gray-700">
            <p>
              Welcome to our guides section. Here you will find useful information
              about our products and how to get the most out of them.
            </p>
            <h2 className="text-2xl font-semibold mt-6">1. Shoe Sizing Guide</h2>
            <p>
              Finding the right fit is essential for comfort and performance. Our
              sizing guide will help you find the perfect size for your feet.
            </p>
            <h2 className="text-2xl font-semibold mt-6">2. Shoe Care Guide</h2>
            <p>
              Proper care will extend the life of your shoes. Learn how to clean
              and maintain your Nike shoes to keep them looking their best.
            </p>
            <h2 className="text-2xl font-semibold mt-6">3. Apparel Care Guide</h2>
            <p>
              Our apparel is designed to perform. Follow our care instructions to
              ensure your Nike apparel stays in great condition.
            </p>
            <h2 className="text-2xl font-semibold mt-6">4. Contact Us</h2>
            <p>
              If you have any questions about our guides, please contact us at{" "}
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

export default Guides;
