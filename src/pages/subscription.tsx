import { useToast } from '@/components/toast-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Subscription() {
  const [searchParams] = useSearchParams();
  const referrer = searchParams.get("referrer");
  const success = searchParams.get("success");
  const navigate = useNavigate()
  const { showError } = useToast();

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
    .then(
      res => {
        if(res.status == 303){
          return res.json();
        } else if(res.status == 401) {
          navigate('/auth');
          throw 'You need to be logged in to subscribe.'
        } else if (res.status == 403){
          throw 'You have already used the free trial subscription.'
        } else if(res.status == 409){
          throw 'You already have an active subscription.'
        } else {
          throw 'An error occurred while processing your request.'
        }
      }
    )
    .then(
      data => {
        window.location.href = data.url
      }
    )
    .catch(
      err => {
        showError(err);
      }
    )
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
        <p className="text-lg text-purple-200/60 mb-4">
          Select the perfect plan for your automation needs. All plans include our core features.
        </p>
        <div className="inline-flex items-center gap-2 bg-purple-950/30 px-4 py-2 rounded-full text-sm">
          <ArrowRight className="h-4 w-4 text-green-400" />
          <span>Cancel anytime - no commitments!</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card 
          className="p-8 hover:border-purple-400/30 transition-all hover:transform hover:-translate-y-1"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Autonomy Essentials</h2>
            <div className="flex justify-center items-end gap-4 mb-6">
              <div>
                <p className="text-4xl font-bold">€14.99</p>
                <p className="text-sm text-purple-200/60">EUR/month</p>
              </div>
              <div>
                <p className="text-4xl font-bold">$14.99</p>
                <p className="text-sm text-purple-200/60">USD/month</p>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>200 scripts limit</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>Community Access: Discover scripts that fit your tasks</span>
              </div>
            </div>

            {/* <p className="text-sm text-purple-200/60 mb-6">
              By subscribing you agree to our
              <br />
              <a className="text-purple-400 hover:underline" href="/legal/refund-policy" target="_blank">
                Refund and Cancellation Policy
              </a>
            </p> */}

            <div className="space-y-4">
              <Button 
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe(8)}
              >
                Unlock Digital Autonomy
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-200/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-purple-200/60">or</span>
                </div>
              </div>

              <Button 
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe(6)}
              >
                Try 1 week free
              </Button>
              <p className="text-xs text-purple-200/40">Only one free trial is allowed per user</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-8 hover:border-purple-400/30 transition-all hover:transform hover:-translate-y-1"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Autonomous Master</h2>
            <div className="flex justify-center items-end gap-4 mb-6">
              <div>
                <p className="text-4xl font-bold">€29.99</p>
                <p className="text-sm text-purple-200/60">EUR/month</p>
              </div>
              <div>
                <p className="text-4xl font-bold">$29.99</p>
                <p className="text-sm text-purple-200/60">USD/month</p>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>Everything in Autonomy Essentials</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>1000 scripts limit</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>Premium support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>Custom automation support</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span>Script monetization program (coming soon)</span>
              </div>
            </div>

            {/* <p className="text-sm text-purple-200/60 mb-6">
              By subscribing you agree to our
              <br />
              <a className="text-purple-400 hover:underline" href="/legal/refund-policy" target="_blank">
                Refund and Cancellation Policy
              </a>
            </p> */}

            <Button 
              className="w-full"
              size="lg"
              onClick={() => handleSubscribe(7)}
            >
              Unlock Digital Autonomy
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}