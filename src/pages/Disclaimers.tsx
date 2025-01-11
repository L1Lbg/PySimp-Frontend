const Disclaimers = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Disclaimers</h1>
      <p className="text-lg mb-4">Effective Date: January 11, 2025</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">No Warranty</h2>
        <p>Autonomia provides no warranty regarding the performance, reliability, or suitability of the website or its services for your intended purpose.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Use of Scripts</h2>
        <p>Autonomia is a platform for users to create, share, and download scripts. You are solely responsible for the content and actions of the scripts you download and run. We are not liable for any damages or consequences resulting from the use of these scripts.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, Autonomia is not liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the website or downloaded scripts.</p>
      </section>
    </div>
  );
};

export default Disclaimers;
