import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/navbar';
import Landing from '@/pages/landing';
import Community from '@/pages/community';
import Profile from '@/pages/profile';
import Search from '@/pages/search';
import Settings from '@/pages/settings';
import Editor from '@/pages/editor';
import { useEffect, useState } from 'react';
import Auth from './pages/auth';
import Favorites from './pages/favorites';
import Google from './pages/google';

function App() {
  const [debug, setDebug] = useState(false)
  useEffect(()=>{
    //* refresh tokens if needed
    const date = new Date();
    if(localStorage.getItem('expiry') && parseInt(localStorage.getItem('expiry')) < date.getTime() + 10*60*1000){ // in milliseconds
      fetch(`${import.meta.env.VITE_API_URL}/authentication/token/refresh/`,

        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({
            'refresh':localStorage.getItem('refresh')
          })
        }
      )
      .then(
        res => {
          if(!res.ok){
            localStorage.clear()
          } else {
            console.debug('Successfully refreshed')
            return res.json()
          }
        }
      )
      .then(
        data => {
          if(data){
            const now = new Date();
            localStorage.setItem('access', data.access)
            localStorage.setItem('refresh', data.refresh)
            localStorage.setItem('expiry', `${now.getTime()+60*60*1000}`);
          }
        }
      )
    } else {
      console.debug('No need to refresh token')
    }

    //* toggle debug mode
    try {
      const ls_debug = localStorage.getItem('debug')
      if(ls_debug == undefined){
        setDebug(import.meta.env.VITE_DEBUG.toLowerCase() == 'true')
      } else {
        setDebug(ls_debug=='true');
      }
    } catch (error) {
      setDebug(true)
    }


    
  },[])
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
                <Route path="/auth" element={<Auth />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/create/:id" element={<Editor />} />
                <Route path="/google/login" element={<Google />} />
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