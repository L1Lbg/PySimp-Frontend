import { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { features, benefits, useCases } from '@/data/landingPageData';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    fetch('https://api.getwaitlist.com/api/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email:email,
        waitlist_id:22313
      }),
    })
    .then(
      res => {
        if(res.ok){
          setSubmitted(true);
          setEmail('')
        } else {
          alert('There was an error with your signup, please try again.')
        }
        setLoading(false);
      }
    )
    
    
  };

  return (
    <>
      <div className="text-center max-w-4xl mx-auto px-4 pt-20">
        <h1 className="text-5xl font-bold mb-6">
          Transform Ideas into Python Scripts
          <span className="text-purple-400"> Without Code</span>
        </h1>
        <p className="text-xl text-purple-200/60 mb-8">
          Build powerful automation scripts using our visual block editor. 
          From mouse control to web requests, create Python scripts without writing a single line of code.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-16">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-purple-950/30 border border-purple-200/20 focus:outline-none focus:border-purple-400 text-purple-50 placeholder:text-purple-200/40"
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? 'Joining...' : 'Join Waitlist'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {submitted && (
            <div className="mt-2 text-green-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <p>Thanks for joining! We'll notify you soon.</p>
            </div>
          )}
        </form>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 h-20 bottom-0"></div>
          <img
            src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80"
            alt="Code editor interface"
            className="rounded-lg shadow-2xl mb-16"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-purple-950/20 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h2 className="text-3xl font-bold">Key Features</h2>
            </div>
            <p className="text-purple-200/60">Everything you need to automate your workflow</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-lg bg-purple-950/30 hover:bg-purple-950/40 transition-colors">
                <feature.icon className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-purple-200/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Pysimp?</h2>
            <p className="text-purple-200/60">Powerful features that make automation accessible to everyone</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 rounded-lg bg-purple-950/30 hover:bg-purple-950/40 transition-colors">
                <benefit.icon className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-purple-200/60">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="bg-purple-950/20 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Use Cases</h2>
            <p className="text-purple-200/60">Discover how Pysimp can transform your workflow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <img
                  src={useCase.image}
                  alt={useCase.title}
                  className="w-full h-64 object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                  <p className="text-purple-200/60">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-purple-500 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Simplify Your Automation?</h2>
            <p className="text-xl mb-8">Join our waitlist and be the first to experience the future of visual programming</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-white text-purple-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Waitlist
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}