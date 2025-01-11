const ReferralProgram = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Referral Program Terms</h1>
      <p className="text-lg mb-4">Effective Date: January 11, 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Eligibility</h2>
        <p>All users who have setup a monetized account on the <a className="text-purple-500" target='_blank' href='/settings'>Settings Page</a> are eligible to participate in the referral program. Users must refer new customers who sign up and start paying for a subscription.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Rewards</h2>
        <p>
          For each successful referral, users will receive 35% of the subscription price on the first month, and a 70% of the subscription price of the third month, if the referred user is still subscribed by that point.
          <br />
          This only applies if the payments made by the referred user are successful and not disputed. 
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Referral Restrictions</h2>
        <ul className="list-disc pl-6">
          <li><strong>No Self-referrals:</strong> Referring yourself or signing up under multiple accounts to claim rewards is strictly prohibited and won't work.</li>
          <li><strong>Fraud Prevention:</strong> We reserve the right to disqualify users from the referral program if they engage in fraudulent activities or abuse the program.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Changes to Program</h2>
        <p>We reserve the right to modify or terminate the referral program at any time. Users will be notified of any significant changes.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Contact Us</h2>
        <p>For questions regarding the referral program, please contact us at: <a href="mailto:autonomiasupport@proton.me" className="text-blue-600">autonomiasupport@proton.me</a>.</p>
      </section>
    </div>
  );
};

export default ReferralProgram;
