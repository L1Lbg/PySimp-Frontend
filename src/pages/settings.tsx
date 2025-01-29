import { useEffect, useState } from 'react';
import { Save, KeyRound, User, DollarSign, Subscript, AlertTriangle, CalendarCheckIcon, CircleEllipsis, LinkIcon, X, UserX, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/toast-provider';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { showError } = useToast();
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingUsername, setChangingUsername] = useState(false);
  const queryParameters = new URLSearchParams(window.location.search)
  const success = queryParameters.get("success")
  const navigate = useNavigate()



  useEffect(()=>{
    if(success){
      localStorage.setItem('subscription', true)
      localStorage.removeItem('referral')
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
    referral_stats:{
      "claimed": 0,
      "unclaimed": 0,
      "disputed": 0,
      "claimed_money": 0,
      "unclaimed_money": 0,
      "disputed_money": 0
    },
  });

  // load initial profile
  useEffect(()=>{
    fetch(`${localStorage.getItem('api_url')}/authentication/manage/users/me`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`,
        }
      }
    )
    .then(
      res => {
          if(res.ok){
            return res.json()
          } else if(res.status==401){
            navigate('/auth')
          } else {
            throw res.json()
          }
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
        showError(error.error)
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
    fetch(`${localStorage.getItem('api_url')}/authentication/password/reset`,
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
      `${localStorage.getItem('api_url')}/payments/unsubscribe/`,
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
    fetch(`${localStorage.getItem('api_url')}/authentication/username/change`,
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

  const handleAccountDeletion = async () => {
    const response = await fetch(
      `${localStorage.getItem('api_url')}/authentication/user/delete`,
      {
        'method':'DELETE',
        'headers':{
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      }
    )

    if(!response.ok){
      const data = await response.json();
      showError(data.error)
    } else {
      localStorage.removeItem('access')
      localStorage.removeItem('expiry')
      localStorage.removeItem('refresh')
      localStorage.removeItem('username')
      window.location.href = '/auth'
    }
  }

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
          <input className='w-full text-center' value={`${import.meta.env.VITE_FRONTEND_URL}/subscribe?referrer=${profile.referral_code}`} disabled/>
        </Card>

        <br />

        <Card>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{  padding: "8px" }}>Type</th>
                <th style={{  padding: "8px" }}>Subs Count</th>
                <th style={{  padding: "8px" }}>Total Money</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{  padding: "8px" }}>Paid</td>
                <td style={{  padding: "8px" }}>{profile.referral_stats.claimed}</td>
                <td style={{  padding: "8px" }}>€{profile.referral_stats.claimed_money.toFixed(2)}</td>
              </tr>
              <tr>
                <td style={{  padding: "8px" }}>Unpaid</td>
                <td style={{  padding: "8px" }}>{profile.referral_stats.unclaimed}</td>
                <td style={{  padding: "8px" }}>€{profile.referral_stats.unclaimed_money.toFixed(2)}</td>
              </tr>
              <tr className='hover:cursor-help text-red-500'>
                <td style={{  padding: "8px" }} 
                title='Disputed subscriptions will not be paid. Please refer to the Referral Program Policies below for more information.' 
                className='flex items-center'><HelpCircle className='h-4 w-4 mr-2'/>
                  Disputed
                </td>
                <td style={{  padding: "8px" }}>{profile.referral_stats.disputed}</td>
                <td style={{  padding: "8px" }}>€{profile.referral_stats.disputed_money.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </Card>
        <br />
        <Button type="button" className="w-full space-x-2"
                onClick={
                  (e) => {
                    fetch(
                      `${localStorage.getItem('api_url')}/payments/onboarding`,
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
                <span>{profile.referral_code == null ? 'Setup' : 'Edit'} your monetized account</span>
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
            <li>Phone number</li>
            <li>Birth date</li>
            <li>Identity verification</li>
            <li>Bank account details</li>
          </ul>
        </Card>

        <br />
        <br />
        <br />


        <Card className='p-6'>
          <h2 className='text-lg text-red-500 font-semibold mb-4 flex items-center'>
            <UserX className="h-5 w-5 mr-2"/>
            Account deletion
          </h2>
          <p>
            Autonomia will:
            <ul style={{listStyle:'disc'}} className='ml-7'>
              <li>
                Delete your account from the databases.
              </li>
              <li>
                Remove your customer account on Stripe, effectively deleting all information about your payment information.
              </li>
              <li>
                Remove your monetized account (if existing).
              </li>
            </ul>
            <br />
            <span className='text-red-500'>This action is not reversible</span>
          </p>
          <br />
          <Button variant='destructive' onClick={handleAccountDeletion}>
            Delete account
          </Button>
        </Card>
      </div>
    </div>
  );
}
