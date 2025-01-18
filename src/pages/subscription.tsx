import { useToast } from '@/components/toast-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Subscription() {
  const [searchParams] = useSearchParams();
  const referrer = searchParams.get("referrer");
  const success = searchParams.get("success");
  const { showError } = useToast();

  const subscriptions = [
    {
      id: 5,
      name: 'One Week Free Trial',
      eur_price: 0,
      usd_price: 0,
      features: [
        'Community access',
        '20 scripts limit',
        'Basic support'
      ]
    },
    {
      id: 3,
      name: 'Autonomer Tier',
      eur_price: 14.99,
      usd_price: 14.99,
      features: [
        'Everything in Free Trial',
        '200 scripts limit',
        'Priority support',
      ]
    },
    {
      id: 4,
      name: 'Premium Tier',
      eur_price: 29.99,
      usd_price: 29.99,
      features: [
        'Everything in Autonomer Tier',
        '1000 scripts limit',
        'Premium support',
        'Custom automation support',
        'Script monetization program (coming soon)'
      ]
    },
  ];

  const handleSubscribe = (subId: number) => {
    fetch(
      `${localStorage.getItem('api_url')}/payments/checkout/${subId}?referrer=${referrer}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      }
    )
    .then(response => response.json())
    .then(data => {
      if(data.url) {
        window.location.href = data.url;
      } else if(data.error) {
        showError(data.error);
      }
    });
  };

  useEffect(() => {
    if(success) {
      showError('Your subscription process was interrupted.');
    }
  }, [success]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Sparkles className="h-12 w-12 mx-auto mb-4 text-purple-400" />
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-purple-200/60">
          Select the perfect plan for your automation needs. All plans include our core features.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {subscriptions.map(sub => (
          <Card 
            key={sub.id} 
            className="p-8 hover:border-purple-400/30 transition-all hover:transform hover:-translate-y-1"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">{sub.name}</h2>
              <div className="flex justify-center items-end gap-4 mb-6">
                <div>
                  <p className="text-4xl font-bold">€{sub.eur_price}</p>
                  <p className="text-sm text-purple-200/60">EUR/month</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">${sub.usd_price}</p>
                  <p className="text-sm text-purple-200/60">USD/month</p>
                </div>
              </div>

              <div className="space-y-4 mb-8 text-left">
                {sub.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-purple-200/60 mb-6">
                By subscribing you agree to our
                <br />
                <a className="text-purple-400 hover:underline" href="/legal/refund-policy" target="_blank">
                  Refund and Cancellation Policy
                </a>
              </p>

              <Button 
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe(sub.id)}
              >
                {sub.eur_price === 0 ? 'Start Free Trial' : 'Subscribe Now'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}