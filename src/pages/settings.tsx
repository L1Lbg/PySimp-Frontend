import { useEffect, useState } from 'react';
import { Save, KeyRound, User, DollarSign, Subscript, AlertTriangle, CalendarCheckIcon, CircleEllipsis, LinkIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/toast-provider';

export default function Settings() {
  const { showError } = useToast();
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingUsername, setChangingUsername] = useState(false);
  const queryParameters = new URLSearchParams(window.location.search)
  const success = queryParameters.get("success")



  useEffect(()=>{
    if(success){
      localStorage.setItem('subscription', true)
    }
  },[success])

  const [passwordData, setPasswordData] = useState({
    currentPassword:'',
    newPassword:'',
    confirmPassword:'',
  });



  const [profile, setProfile] = useState({
    email: 'Loading...',
    username: 'Loading...',
    registration_method:'None',
    referral_code:'XXXXXX',
    subscription:null,
  });

    // load initial profile
  useEffect(()=>{
    fetch(`${import.meta.env.VITE_API_URL}/authentication/manage/users/me`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        }
      }
    )
    .then(
      res => {
  
          return res.json()
      }
    )
    .then(
      data => {
        if(!data.error){
          setProfile(data);
        } else {
          throw data.error
        }
      }
    )
    .catch(
      error => {
        showError(error)
      }
    )
  },[])


  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if(passwordData.newPassword.length < 6){
      showError('Password must be at least 6 characters long')
      return;
    }

    if(passwordData.newPassword !== passwordData.confirmPassword){
      showError('Passwords don\'t match')
      return;
    }




    setChangingPassword(true);
    fetch(`${import.meta.env.VITE_API_URL}/authentication/password/reset`,
      {
        method: 'POST',
        body: JSON.stringify(passwordData),
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('access')}`,
          'Content-Type':'application/json'
        }
      }
    )
    .then(
      res => {
        setChangingPassword(false)
        if(!res.ok){
          return res.json();
        } else {
          return {}
        }
      }
    )
    .then(
      data => {
        if(data.error){
          showError(data.error)
        } else if(data.detail) {
          showError(data.detail)
        } 
      }
    )
    .catch(
      error=>{
        showError(error)
      }
    )
  };

  const handleUnsubscribe = (e) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/payments/unsubscribe/`,
      {
        method: 'POST',
        headers: {
          'Authorization':`Bearer ${localStorage.getItem('access')}`,
        }
      }
    )
    .then(
      res => res.json()
    )
    .then(
      data => {
        if(data.success){
          localStorage.removeItem('subscription')
          window.location.reload()
        } else if (data.error){
          showError(data.error)
        }
      }
    )
  }

  const handleUsernameChange = (e: React.FormEvent) => {
    e.preventDefault();
    setChangingUsername(true);
    fetch(`${import.meta.env.VITE_API_URL}/authentication/username/change`,
      {
        method: 'POST',
        body: JSON.stringify({'username':profile.username}),
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('access')}`,
          'Content-Type':'application/json'
        }
      }
    )
    .then(
      res => {
        setChangingUsername(false)
        if(!res.ok){
          return res.json();
        } else {
          return {}
        }
      }
    )
    .then(
      data => {
        if(data.error){
          showError(data.error)
        } else if(data.detail) {
          showError(data.detail)
        } 
      }
    )
    .catch(
      error=>{
        showError(error)
      }
    )
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        <form onSubmit={handleUsernameChange} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input disabled type="email" value={profile?.email} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Username
                </label>
                <Input
                  value={profile.username}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                  placeholder="Enter username"
                />
              </div>
            </div>
          </Card>

          <Button disabled={changingUsername} type="submit" className="w-full space-x-2">
            <Save className="h-4 w-4" />
            
            {
              changingUsername ? (
                <span>Changing username...</span>
              ) : (
                <span>Change username</span>
              )
            }
          </Button>
        </form>

        <br />


        {
          profile.registration_method == 'Mail' && (
            <form onSubmit={handleResetPassword} className="space-y-6 mt-6">

              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <KeyRound className="h-5 w-5 mr-2" />
                  Change Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
              </Card>

              <Button disabled={changingPassword} type="submit" className="w-full space-x-2">
                <KeyRound className="h-4 w-4" />
                {
                  changingPassword ? (
                    <span>Changing password...</span>
                  ) : (
                    <span>Change password</span>
                  )
                }
              </Button>
            </form>
          )
        }

        <br />
        <br />

        <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CalendarCheckIcon className="h-5 w-5 mr-2" />
              Subscription
            </h2>
            {
              profile.subscription != null ? (
                <>
                  <p>
                    You are subscribed to the <b>{profile.subscription.name}</b>.
                    Subscription started on {new Date(profile.subscription.start).toDateString()} and ends on {new Date(profile.subscription.end).toDateString()}. 
                  </p>
                  <br />
                  <Button variant='destructive' type="button" className="w-full space-x-2" onClick={handleUnsubscribe}>
                    <X className="h-4 w-4" />
                    <span>Cancel subscription</span>
                  </Button>
                </>
              ) : (
                <p>
                  You currently do not have a subscription.
                  <br />
                  Click <a href='/subscribe' className='text-purple-700'>here</a> to subscribe.
                </p>
              )
            }
        </Card>
        <br />
        <br/>
        <Card className='text-center p-6'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <LinkIcon className="h-5 w-5 mr-2"/>
            Your affiliate link
          </h2>
          {
            profile.referral_code == null ? (
              <input className='w-full text-center' 
              value='You need to setup your monetized account to get a referral code'
              disabled/>
            ) : (
              <input className='w-full text-center' value={`${import.meta.env.VITE_FRONTEND_URL}/subscribe?referrer=${profile.referral_code}`} disabled/>
            )
          }
        </Card>
        <br />
        <Button type="button" className="w-full space-x-2"
                onClick={
                  (e) => {
                    fetch(
                      `${import.meta.env.VITE_API_URL}/payments/onboarding`,
                      {
                        method: 'GET',
                        redirect: 'follow',
                        headers: {
                          'Authorization':`Bearer ${localStorage.getItem('access')}`,
                        }
                      }
                    )
                    .then(
                      res => res.json()
                    )
                    .then(
                      data => window.location.href = data.url
                    )
                }
              }
              >
                <DollarSign className="h-4 w-4" />
                <span>Setup/Edit your monetized account</span>
        </Button>
        <br />
        <br />
        <Card className='p-6'>
          <h2 className='text-lg text-red-500 font-semibold mb-4 flex items-center'>
            <AlertTriangle className="h-5 w-5 mr-2"/>
            Important information for monetized accounts, read before setup.
          </h2>
          <p>
            By creating a monetized account, you agree to the <a className='text-purple-500' href='/legal/referral-program' target='_blank'>Referral Program</a> policies.
            <br />
            <br />
            The information will only be handled by <a className='text-purple-500' href='https://stripe.com' target='_blank'>Stripe</a>. 
            Please read their legal terms before setting up your account.
            <br />
            <br />
            The requested personal information is the following:
          </p>
          <ul className='ml-5' style={{listStyleType:'disc'}}>
            <li>Full legal name</li>
            <li>Home address</li>
            <li>Bank account details</li>
            <li>Identity verification</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
