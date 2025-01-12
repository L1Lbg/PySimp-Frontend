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


  const subscriptions = [
    {
      'id':5,
      'name':'One Week Free Trial',
      'eur_price':0,
      'usd_price':0,
    },
    {
      'id':3,
      'name':'Autonomer Tier',
      'eur_price':30,
      'usd_price':32,
    },
    {
      'id':4,
      'name':'Premium Tier',
      'eur_price':55,
      'usd_price':60,
    },
  ]

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
      <div className={`grid md:grid-cols-${subscriptions.length} gap-8 max-w-7xl mx-auto`}>

        {
          subscriptions.map(sub => (
            <Card className="p-6 hover:border-purple-400/30 transition-colors" key={sub.id}>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">{sub.name}</h2>
                <div className="flex justify-center gap-4 mb-6">
                  <p className="text-3xl font-bold">€{sub.eur_price}</p>
                  <p className="text-3xl font-bold">${sub.usd_price}</p>
                </div>

                <p className='text-gray-500'>
                  By clicking this button you agree on the <a className='text-purple-500' href='/legal/refund-policy' target='_blank'>Refund Policy</a>
                </p>
                <br />
                <Button 
                  className="w-full" 
                  onClick={() => handleSubscribe(sub.id)}
                >
                  Subscribe
                </Button>
              </div>
            </Card>
          ))
        }
      </div>
    </div>
  );
}