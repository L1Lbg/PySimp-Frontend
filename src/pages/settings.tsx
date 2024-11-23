import { useState } from 'react';
import { Save, KeyRound, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Settings() {
  const [settings, setSettings] = useState({
    emailUpdates: true,
    language: 'en',
  });

  const [profile, setProfile] = useState({
    email: 'john@example.com',
    username: 'johndoe',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for saving settings
    console.log('Saving settings:', { settings, profile });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input disabled type="email" value={profile.email} />
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
                  value={profile.currentPassword}
                  onChange={(e) =>
                    setProfile({ ...profile, currentPassword: e.target.value })
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
                  value={profile.newPassword}
                  onChange={(e) =>
                    setProfile({ ...profile, newPassword: e.target.value })
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
                  value={profile.confirmPassword}
                  onChange={(e) =>
                    setProfile({ ...profile, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Notifications
            </h2>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.emailUpdates}
                  onChange={(e) =>
                    setSettings({ ...settings, emailUpdates: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-purple-200/20 text-purple-400 focus:ring-purple-400 focus:ring-offset-black"
                />
                <span>Receive email updates</span>
              </label>
            </div>
          </Card>

          <Button type="submit" className="w-full space-x-2">
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
