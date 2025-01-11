
const RefundPolicy = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Refund Policy</h1>
      <p className="text-lg mb-4">Effective Date: January 11, 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Non-refundable Subscriptions</h2>
        <p>All subscription payments are non-refundable. Once you are charged for a billing period, no refunds will be issued, even if you cancel the service before the end of the billing cycle.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Cancellation</h2>
        <p>You can cancel your subscription at any time through your account settings page. Cancellation will prevent further billing.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Support</h2>
        <p>If you have any billing or account-related issues, you can reach out to us at: <a href="mailto:autonomiasupport@proton.me" className="text-blue-600">autonomiasupport@proton.me</a>.</p>
      </section>
    </div>
  );
};

export default RefundPolicy;
