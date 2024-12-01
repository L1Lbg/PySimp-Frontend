import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/navbar';
import Landing from '@/pages/landing';
import Community from '@/pages/community';
import Project from '@/pages/project';
import Profile from '@/pages/profile';
import Search from '@/pages/search';
import Settings from '@/pages/settings';
import Editor from '@/pages/editor';

function App() {
  const debug = import.meta.env.VITE_DEBUG.toLowerCase() == 'true'
  console.log(debug)
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-950">
        {
          !debug ? (
            <></>
          ) : (
            <Navbar />
          )
        }
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Landing />} />
                {
              !debug ? (
                <></>
              ) : (
                <>
                <Route path="/community" element={<Community />} />
                <Route path="/project/:id" element={<Project />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/create/:id" element={<Editor />} />
                </>
              )
            }
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;