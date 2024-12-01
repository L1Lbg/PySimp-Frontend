import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, Search, Settings, User, ChevronDown, Plus, LogIn } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would normally come from auth context
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search');
    navigate(`/search?q=${query}`);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-purple-200/10 bg-black/50 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Autonomia
            </span>
          </Link>

          {isLoggedIn && (
            <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-200/40" />
                <input
                  type="search"
                  name="search"
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-2 bg-purple-950/20 border border-purple-200/20 rounded-full text-sm focus:outline-none focus:border-purple-400/40 text-purple-50 placeholder:text-purple-200/40"
                />
              </div>
            </form>
          )}

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/community" className="text-purple-200/60 hover:text-purple-50">
                  Community
                </Link>
                <Link to="/create/0" className="hidden sm:flex">
                  <Button size="sm" className="space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>New Project</span>
                  </Button>
                </Link>
                
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="space-x-1"
                  >
                    <User className="h-4 w-4" />
                    <ChevronDown className="h-3 w-3" />
                  </Button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-black/90 border border-purple-200/20 rounded-lg shadow-lg backdrop-blur-lg py-1">
                      <Link
                        to="/profile/me"
                        className="flex items-center px-4 py-2 text-sm text-purple-200/60 hover:bg-purple-200/5"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-purple-200/60 hover:bg-purple-200/5"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-purple-200/5"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Button onClick={() => setIsLoggedIn(true)} size="sm" className="space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}