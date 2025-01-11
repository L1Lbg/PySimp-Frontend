const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-lg mb-4">Effective Date: January 11, 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Introduction</h2>
        <p>
          At Autonomia, we value your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal data. By using our website, you agree to the practices outlined in this policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Information We Collect</h2>
        <ul className="list-disc pl-6">
          <li>Personal Data: When you sign up or log in to Autonomia, we collect your username and email address for user authentication purposes.</li>
          <li>Payment Information: All payment data is handled and stored by Stripe. We do not store or process payment details.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
        <ul className="list-disc pl-6">
          <li>Authentication: Your username and email are used for account creation, login, and user authentication.</li>
          <li>Account Management: We use your email to communicate important account information, including subscription details and support requests.</li>
          <li>No Third-Party Sharing: We do not share your personal data with third-party services, except where necessary for payment processing via Stripe.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Data Retention</h2>
        <p>We retain your data until you choose to delete your account. You can delete your account at any time through your account settings.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">User Rights</h2>
        <ul className="list-disc pl-6">
          <li>Access your personal data.</li>
          <li>Correct any inaccuracies in your personal data.</li>
          <li>Delete your account and data.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Cookies</h2>
        <p>We do not use cookies on our website, nor do we track users in any way.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Data Security</h2>
        <p>We take reasonable measures to protect your personal data, but we cannot guarantee absolute security due to the inherent risks of online data transmission.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <p>If you have any questions or concerns about our privacy practices, please contact us at: <a href="mailto:autonomiasupport@proton.me" className="text-blue-600">autonomiasupport@proton.me</a>.</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
