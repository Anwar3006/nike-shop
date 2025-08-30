import React from "react";

const TermsOfSale = () => {
  return (
    <div className="bg-white text-black font-bevellier">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Terms of Sale</h1>
          <div className="space-y-1 text-gray-700 text-center">
            <p>
              These Terms of Sale (&quot;Terms&quot;) apply to all purchases of
              products from the Nike Shop. Please read these Terms carefully
              before placing an order.
            </p>
            <h2 className="text-2xl font-semibold mt-6">1. Orders</h2>
            <p>
              All orders are subject to acceptance and availability. We reserve
              the right to refuse or cancel an order for any reason, including
              but not limited to product availability, errors in the description
              or price of the product, or an error in your order.
            </p>
            <h2 className="text-2xl font-semibold mt-6">
              2. Pricing and Payment
            </h2>
            <p>
              All prices are listed in U.S. dollars and are subject to change
              without notice. We accept various payment methods, which will be
              indicated at the time of checkout. You agree to provide current,
              complete, and accurate purchase and account information for all
              purchases made at our store.
            </p>
            <h2 className="text-2xl font-semibold mt-6">
              3. Shipping and Delivery
            </h2>
            <p>
              Shipping and delivery dates are estimates only and cannot be
              guaranteed. We are not liable for any delays in shipments. Risk of
              loss and title for all products pass to you upon our delivery to
              the carrier.
            </p>
            <h2 className="text-2xl font-semibold mt-6">
              4. Returns and Refunds
            </h2>
            <p>
              We accept returns on most products within 30 days of purchase.
              Products must be returned in their original condition. Please see
              our full return policy for more details.
            </p>
            <h2 className="text-2xl font-semibold mt-6">5. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a
                href="mailto:support@nike.com"
                className="text-blue-600 hover:underline"
              >
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

export default TermsOfSale;
