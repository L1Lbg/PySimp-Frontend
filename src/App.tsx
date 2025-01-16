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
import Footer from './components/footer';
import { useToast } from './components/toast-provider';

function App() {
  const [debug, setDebug] = useState(false)
  const {showError} = useToast()
  useEffect(()=>{
    //* initialize server url
    if(localStorage.getItem('api_url') == null){
      localStorage.setItem('api_url', import.meta.env.VITE_API_URL)
    }

    //* check if main server is online 
    fetch(
      `${import.meta.env.VITE_API_URL}/health`,
      { signal: AbortSignal.timeout(2000) }
    )
    .then(
      res => {
        if(res.ok){
          console.info('Main server functional.')
          localStorage.setItem('api_url', import.meta.env.VITE_API_URL)
        }
      }
    )
    .catch(
      err => {
        if(localStorage.getItem('api_url') != import.meta.env.VITE_SECONDARY_API_URL){
          showError('Reloading...')
          console.info('Main server is not functional. Switching to secondary.')
          localStorage.setItem('api_url', import.meta.env.VITE_SECONDARY_API_URL)
          window.location.reload()
        } else {
          console.info('Main server is not functional. Already switched to secondary.')
        }
      }
    )


    //* refresh tokens if needed
    const date = new Date();
    if(localStorage.getItem('expiry') && parseInt(localStorage.getItem('expiry')) < date.getTime() + 10*60*1000){ // in milliseconds
      fetch(`${localStorage.getItem('api_url')}/authentication/token/refresh/`,

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
      .catch(
        error => {
          console.error(error)
          localStorage.clear()
          window.location.reload()
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
      <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 flex" style={{flexDirection:'column'}}>
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
        <Footer/>
      </div>
    </Router>
  );
}

export default App;