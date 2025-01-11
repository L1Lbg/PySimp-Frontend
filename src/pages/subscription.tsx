import { useToast } from '@/components/toast-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Subscription() {

  const queryParameters = new URLSearchParams(window.location.search)
  const referrer = queryParameters.get("referrer")
  const success = queryParameters.get("success")
  const {showError} = useToast();

  const handleSubscribe = (subId: number) => {
    // Subscription handling logic here
    fetch(
      `${import.meta.env.VITE_API_URL}/payments/checkout/${subId}?referrer=${referrer}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        },
      }
    )
    .then(response => response.json())
    .then(
      data => {
        if(data.url){
          window.location.href = data.url
        } else if(data.error){
          showError(data.error)
        }
      }
    )
  };
  // handle success event
  useEffect(()=>{
    if(success){
      showError('Your subscription process was interrupted.')
    }
  },[success])

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h1>
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Free Tier */}
        <Card className="p-6 hover:border-purple-400/30 transition-colors">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">One Week Free Trial</h2>
            <div className="flex justify-center gap-4 mb-6">
              <p className="text-3xl font-bold">€0</p>
              <p className="text-3xl font-bold">$0</p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => handleSubscribe(5)}
            >
              Subscribe
            </Button>
          </div>
        </Card>

        {/* Autonomer Tier */}
        <Card className="p-6 hover:border-purple-400/30 transition-colors">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Autonomer Tier</h2>
            <div className="flex justify-center gap-4 mb-6">
              <p className="text-3xl font-bold">€30 <span className="text-sm">/ month</span></p>
              <p className="text-3xl font-bold">$32 <span className="text-sm">/ month</span></p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => handleSubscribe(3)}
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
              onClick={() => handleSubscribe(4)}
            >
              Subscribe
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}