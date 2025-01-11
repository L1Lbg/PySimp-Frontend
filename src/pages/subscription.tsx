import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Subscription() {
  const handleSubscribe = (subId: string) => {
    // Subscription handling logic here
    console.log(`Subscribing to plan ${subId}`);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Autonomier Tier */}
        <Card className="p-6 hover:border-purple-400/30 transition-colors">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Autonomier Tier</h2>
            <div className="flex justify-center gap-4 mb-6">
              <p className="text-3xl font-bold">€30 <span className="text-sm">/ month</span></p>
              <p className="text-3xl font-bold">$32 <span className="text-sm">/ month</span></p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => handleSubscribe('autonomier')}
            >
              Subscribe
            </Button>
          </div>
        </Card>

        {/* Premium Tier */}
        <Card className="p-6 hover:border-purple-400/30 transition-colors">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Premium Tier</h2>
            <div className="flex justify-center gap-4 mb-6">
              <p className="text-3xl font-bold">€60 <span className="text-sm">/ month</span></p>
              <p className="text-3xl font-bold">$62 <span className="text-sm">/ month</span></p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => handleSubscribe('premium')}
            >
              Subscribe
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}