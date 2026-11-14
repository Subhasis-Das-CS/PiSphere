'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  User 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  
  // UI Steps: 1 = Auth Selection, 2 = Profile Details Form
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Email/Password States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Profile Form States
  const [formData, setFormData] = useState({
    name: '',
    schoolName: '',
    board: 'CBSE', 
    studentClass: 'Class 10',
    phone: '',
    address: ''
  });

  // --- GOOGLE AUTH ---
  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      
      setFormData(prev => ({ 
        ...prev, 
        name: result.user.displayName || '',
      }));
      
      checkIfUserExists(result.user.uid);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  // --- EMAIL / PASSWORD AUTH ---
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      // New email/password users are guaranteed to not exist in Firestore yet
      setStep(2);
    } catch (err: any) {
      // Firebase throws specific errors (e.g., email-already-in-use, weak-password)
      setError(err.message);
    }
    setLoading(false);
  };

  // --- FIRESTORE PROFILE CHECK & SAVE ---
  const checkIfUserExists = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      router.push('/dashboard');
    } else {
      setStep(2);
      setLoading(false);
    }
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email || email,
        ...formData,
        createdAt: new Date().toISOString(),
        testsSolved: 0,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
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
            {step === 2 ? "Complete Profile" : "Create Account"}
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            {step === 2 ? "Just a few more details to get you started." : "Join PiSphere to supercharge your learning."}
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm text-center">{error}</div>}

        {/* STEP 1: AUTHENTICATION SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            
            {/* Google Sign Up */}
            <button 
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-white/20 flex-1"></div>
              <span className="text-xs text-gray-500 uppercase">OR</span>
              <div className="h-px bg-white/20 flex-1"></div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
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
                <label className="text-xs text-gray-400">Password</label>
                <input 
                  required 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none transition" 
                  placeholder="At least 6 characters"
                  minLength={6}
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Sign Up with Email"}
              </button>
            </form>
            
            <p className="text-center text-sm text-gray-400">
              Already have an account? <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">Log in</Link>
            </p>
          </div>
        )}

        {/* STEP 2: PROFILE DETAILS FORM */}
        {step === 2 && (
          <form onSubmit={handleSaveDetails} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400">Full Name</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" />
            </div>
            
            <div>
              <label className="text-xs text-gray-400">School Name</label>
              <input required type="text" value={formData.schoolName} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-400">Board</label>
                <select value={formData.board} onChange={(e) => setFormData({...formData, board: e.target.value})} className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none appearance-none">
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400">Class</label>
                <select value={formData.studentClass} onChange={(e) => setFormData({...formData, studentClass: e.target.value})} className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none appearance-none">
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400">Phone Number (Optional)</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none" />
            </div>

            <div>
              <label className="text-xs text-gray-400">Address</label>
              <textarea required rows={2} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full mt-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500 outline-none resize-none" />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold py-3 rounded-lg hover:opacity-90 transition mt-4 shadow-lg shadow-purple-500/30 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Profile & Continue"}
            </button>
          </form>
        )}

      </div>
    </main>
  );
}