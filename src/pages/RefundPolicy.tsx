
const RefundPolicy = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Refund and Cancellation Policy</h1>
      <p className="text-lg mb-4">Effective Date: January 11, 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Non-refundable Subscriptions</h2>
        <p>All subscription payments are non-refundable. Once you are charged for a billing period, no refunds will be issued, even if you cancel the service before the end of the billing cycle.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Cancellation</h2>
        <p>You can cancel your subscription at any time through your account settings page. Cancellation will prevent further billing. Cancellation prorates.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Proration</h2>
        <p>
          When a subscription is cancelled, it will be prorated.
          <br />
          Proration refers to calculating and charging a user for a proportional amount of a billing cycle based on the number of days the service was used. This ensures the user pays only for the portion of the cycle they utilized, rather than the full period.
          <br />
          <br />
          <u>Example:</u>
          <br />
          Imagine a subscription service costs $30 per month and runs on a 30-day billing cycle. If a user cancels their subscription 15 days into the cycle, they will still be charged for the 15 days they used the service.
          <br />
          To calculate the prorated amount:
          <br />
          Daily cost = $30 ÷ 30 days = $1 per day
          <br />
          Days of usage = 15 days
          <br />
          Prorated charge = $1 × 15 days = $15
          <br />
          The user would be charged $15 for the partial billing cycle instead of the full $30.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Support</h2>
        <p>If you have any billing or account-related issues, you can reach out to us at: <a href="mailto:helpautonomia@proton.me" className="text-blue-600">helpautonomia@proton.me</a>.</p>
      </section>
    </div>
  );
};

export default RefundPolicy;
