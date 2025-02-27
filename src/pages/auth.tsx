import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/toast-provider';

type AuthMode = 'login' | 'signup';

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
}

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { showError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    re_password: '',
    tos:false,
    communications:false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (mode === 'login') {
        const response = await fetch(`${localStorage.getItem('api_url')}/authentication/token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }

        const now = new Date();
        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('username', formData.username);
        localStorage.setItem('expiry', `${now.getTime()+60*60*1000}`); //* time in milliseconds
        localStorage.removeItem('tut-editor')
        navigate('/');
      } else {
        if(formData.tos == false){
          showError('You must agree to the Terms of Service, Privacy Policy and Disclaimers')
          return;
        }
        const response = await fetch(`${localStorage.getItem('api_url')}/authentication/manage/users/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });


        const data = await response.json();

        if (!response.ok) {
          if (data.username) setErrors(prev => ({ ...prev, username: data.username[0] }));
          if (data.email) setErrors(prev => ({ ...prev, email: data.email[0] }));
          if (data.password) setErrors(prev => ({ ...prev, password: data.password[0] }));
          if (data.non_field_errors) setErrors(prev => ({ ...prev, password: data.non_field_errors[0] }));
          throw new Error('Signup failed');
        }

        setMode('login');
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${localStorage.getItem('api_url')}/authentication/oauth2/get-redirect`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-purple-200/60 mt-2">
            {mode === 'login' ? 'Sign in to your account' : 'Sign up for a new account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-purple-200/40" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  autoComplete='email'
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-purple-200/40" />
              <Input
                type="text"
                placeholder="Enter your username"
                className={`pl-10 ${errors.username ? 'border-red-500' : ''}`}
                value={formData.username}
                autoComplete='username'
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              {errors.username && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.username}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-purple-200/40" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                autoComplete={mode === 'signup' ? 'new-password': 'current-password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {errors.password && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-purple-200/40 hover:text-purple-200"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-purple-200/40" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  autoComplete='new-password'
                  className="pl-10"
                  value={formData.re_password}
                  onChange={(e) => setFormData({ ...formData, re_password: e.target.value })}
                />
              </div>
            </div>

              <div className="space-y-2">
              <label className="text-sm font-medium">
                <input
                  type='checkbox'
                  className='mr-3'
                  onChange={(e) => setFormData({ ...formData, tos: e.target.checked })}
                />
                You agree to the  <a href='/legal/tos' className='text-purple-500' target='_blank'>Terms Of Service</a>, <a href='/legal/privacy-policy' className='text-purple-500' target='_blank'>Privacy Policy</a> and <a className='text-purple-500' href='/legal/disclaimers' target='_blank'>Disclaimers</a>.
              </label>
              <br />
              <label className="text-sm font-medium">
                <input
                  type='checkbox'
                  className='mr-3'
                  onChange={(e) => setFormData({ ...formData, communications: e.target.checked })}
                />
                You agree to receive communications.
              </label>
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-200/20"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-purple-200/60">Or continue with</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>

        <div className="text-center text-sm">
          <span className="text-purple-200/60">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          </span>
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-purple-400 hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </Card>
    </div>
  );
}