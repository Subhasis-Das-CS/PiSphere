'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  
  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Toggle between Login and Forgot Password modes
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // --- GOOGLE LOGIN ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Check if user has completed their profile in Firestore
      const docRef = doc(db, "users", result.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        router.push('/dashboard');
      } else {
        // If they haven't set up their profile, send them to signup
        router.push('/signup');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // --- EMAIL / PASSWORD LOGIN ---
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    }
  };

  // --- FORGOT PASSWORD ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
      setIsForgotPassword(false); // Switch back to login view
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <main className="relative min-h-screen bg-[#05050f] flex items-center justify-center p-6 text-white font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-700 rounded-full mix-blend-screen filter blur-[150px] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-700 rounded-full mix-blend-screen filter blur-[150px] opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {isForgotPassword ? "Reset Password" : "Welcome Back"}
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            {isForgotPassword 
              ? "Enter your email to receive a password reset link." 
              : "Log in to access your PiSphere dashboard."}
          </p>
        </div>

        {/* Alerts */}
        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm text-center">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded text-green-200 text-sm text-center">{message}</div>}

        {/* FORGOT PASSWORD FORM */}
        {isForgotPassword ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400">Email Address</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none transition" 
                placeholder="you@example.com"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 mt-2"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
            
            <button 
              type="button"
              onClick={() => { setIsForgotPassword(false); setError(''); setMessage(''); }}
              className="w-full text-sm text-gray-400 hover:text-white mt-4"
            >
              Back to Login
            </button>
          </form>
        ) : (
          
          /* STANDARD LOGIN FORM */
          <div className="space-y-6">
            
            {/* Google Login */}
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Log in with Google
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-white/20 flex-1"></div>
              <span className="text-xs text-gray-500 uppercase">OR</span>
              <div className="h-px bg-white/20 flex-1"></div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Email Address</label>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none transition" 
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-400">Password</label>
                  <button 
                    type="button" 
                    onClick={() => { setIsForgotPassword(true); setError(''); setMessage(''); }}
                    className="text-xs text-purple-400 hover:text-purple-300 transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none transition" 
                  placeholder="••••••••"
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-purple-500/30"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
            
            <p className="text-center text-sm text-gray-400">
              Don't have an account? <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold">Sign up</Link>
            </p>
          </div>
        )}

      </div>
    </main>
  );
}