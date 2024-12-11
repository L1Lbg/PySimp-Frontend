import { useEffect, useState } from 'react';
import { Save, KeyRound, User, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/toast-provider';

export default function Settings() {
  const { showError } = useToast();
  const [changingPassword, setChangingPassword] = useState(false);
  const [changingUsername, setChangingUsername] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword:'',
    newPassword:'',
    confirmPassword:'',
  });



  const [profile, setProfile] = useState({
    email: 'Loading...',
    username: 'Loading...',
    registration_method:'None'
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
      </div>
    </div>
  );
}
