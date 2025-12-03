import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function GoogleCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Processing Google sign-in...');
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userJson = params.get('user');
        const provider = params.get('provider');
        const error = params.get('error');
        
        if (error) {
          setStatus(`Error: ${error}`);
          setTimeout(() => {
            router.push('/?auth_error=' + error);
          }, 3000);
          return;
        }
        
        if (!token || !userJson) {
          setStatus('No authentication data received');
          setTimeout(() => {
            router.push('/?auth_error=no_data');
          }, 3000);
          return;
        }
        
        // Parse user data
        const user = JSON.parse(userJson);
        
        // Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('auth_provider', provider || 'google');
        
        // Also try to set a cookie for this domain
        const isLocalhost = window.location.hostname.includes('localhost');
        const maxAge = 30 * 24 * 60 * 60; // 30 days
        
        document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; ${!isLocalhost ? 'secure; ' : ''}samesite=lax`;
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        setStatus('Success! Redirecting...');
        
        // Short delay then redirect
        setTimeout(() => {
          router.push('/');
        }, 1000);
        
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('Authentication failed');
        setTimeout(() => {
          router.push('/?auth_error=callback_failed');
        }, 3000);
      }
    };
    
    handleCallback();
  }, [router]);
  
  return (
    <>
      <Head>
        <title>Google Sign-in - Ontap Creatives</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Google Sign-in
            </h2>
            <div className="mt-4">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
              <p className="mt-4 text-sm text-gray-600">{status}</p>
            </div>
            <div className="mt-8">
              <p className="text-xs text-gray-500">
                If you are not redirected automatically, <a href="/" className="text-blue-600 hover:text-blue-500">click here</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}