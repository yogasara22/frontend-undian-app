'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000));

    // Simulated auth success
    localStorage.setItem('isAdminLoggedIn', 'true');
    router.push('/dashboard');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-white px-4 py-10">
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-100/50 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-50/50 rounded-full blur-[100px]" />

      <div className="w-full max-w-[22rem] relative z-10 flex flex-col items-center">
        {/* Title */}
        <div className="flex flex-col items-center mb-6 text-center">
          <h1 className="text-2xl sm:text-[1.65rem] font-black text-gray-900 tracking-tight">
            whoisthewinners.com
          </h1>
          <p className="text-gray-500 mt-1.5 text-sm font-medium">
            Selamat datang kembali di Control Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl p-6 shadow-xl shadow-gray-200/40">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-0.5">
                Username
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin_undian"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 transition-all text-sm font-medium outline-none text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-1.5 ml-0.5">
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 transition-all text-sm font-medium outline-none text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? (
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-70 disabled:cursor-not-allowed text-white text-xs font-black tracking-wider shadow-md shadow-orange-600/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-1"
            >
              {isLoading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Masuk...
                </>
              ) : (
                'MASUK KE DASHBOARD'
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-gray-400 text-[11px] font-medium tracking-wide">
          © 2026 whoisthewinners.com
        </p>
      </div>
    </div>
  );
}
