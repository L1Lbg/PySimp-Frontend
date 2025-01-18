const TermsOfService = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-lg mb-4">Effective Date: January 11, 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Introduction</h2>
        <p>These Terms of Service ("Terms") govern your use of the Autonomia website and services. By accessing or using Autonomia, you agree to these Terms.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Account Creation</h2>
        <p>To use our services, you must create an account using your email address and username. You are responsible for maintaining the confidentiality of your login credentials.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Subscription and Payments</h2>
        <ul className="list-disc pl-6">
          <li>Billing: Autonomia offers a subscription-based service billed on a monthly cycle. We accept all payment methods supported by Stripe.</li>
          <li>Non-refundable: Please note that all subscription payments are non-refundable.</li>
          <li>Subscription Cancellation: You can cancel your subscription at any time through your account settings page, the subscription will be <a target="_blank" className='text-purple-500' href={`${import.meta.env.VITE_FRONTEND_URL}/legal/refund-policy`}>prorated</a>.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Account Termination</h2>
        <p>We reserve the right to suspend or terminate your account if you engage in activities that violate our Terms, such as:</p>
        <ul className="list-disc pl-6">
          <li>Creating scripts containing malware or inappropriate content.</li>
          <li>Engaging in abusive behavior or violating other users’ rights.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Use of Services</h2>
        <p>Autonomia provides a visual code editor that allows users to automate tasks, including moving the mouse, typing, making requests, and more. Users can also download and share scripts with other community members.</p>
        <p><strong>User Responsibility:</strong> You are solely responsible for the scripts you download and execute on Autonomia. We are not liable for any consequences, damages, or issues caused by these scripts.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Prohibited Conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6">
          <li>Use the service for any illegal or malicious activities.</li>
          <li>Upload, create, or share harmful or inappropriate content, including malware.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, Autonomia is not responsible for any damages, losses, or issues arising from the use of the website or downloaded scripts.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Changes to Terms</h2>
        <p>We reserve the right to modify or update these Terms at any time. We will notify you of any significant changes.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Governing Law</h2>
        <p>These Terms will be governed by the laws of Spain, without regard to its conflict of law principles.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <p>If you have questions or concerns about these Terms, please contact us at: <a href="mailto:helpautonomia@proton.me" className="text-blue-600">helpautonomia@proton.me</a>.</p>
      </section>
    </div>
  );
};

export default TermsOfService;
