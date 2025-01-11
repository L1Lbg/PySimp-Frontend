import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
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
import Guide from './pages/guides';
import Subscription from './pages/subscription';
import Activate from './pages/activate';
import CookiePolicy from './pages/CookiePolicy';
import Disclaimers from './pages/Disclaimers';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ReferralProgram from './pages/ReferralProgram';
import RefundPolicy from './pages/RefundPolicy';
import TermsOfService from './pages/TermsOfService';

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
      //todo: add a timeout to refresh token
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
            <Route path="/google/login" element={<Google />} />
            <Route path="/activate/:uid/:token" element={<Activate />} />

            <Route path="/legal/tos" element={<TermsOfService />} />
            <Route path="/legal/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/legal/disclaimers" element={<Disclaimers />} />

            <Route path="/legal/referral-program" element={<ReferralProgram />} />
            <Route path="/legal/refund-policy" element={<RefundPolicy />} />
            
            <Route path="/legal/cookie-policy" element={<CookiePolicy />} />

                {
              debug && (
                <>
                <Route path="/community" element={<Community />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/create/:id" element={<Editor />} />
                <Route path="/guide/:id" element={<Guide />} />
                <Route path="/subscribe" element={<Subscription />} />
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