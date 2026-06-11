import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log(response.data);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );
      navigate('/group-lobby');
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMsg(error.response?.data?.message || "Invalid credentials. Please verify your email and security token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-body-md bg-[#000000] text-[#e4e1ed] overflow-x-hidden selection:bg-primary/30 min-h-screen flex items-center justify-center p-4 sm:p-6 relative grid-bg">
      <div className="noise-overlay"></div>
      
      {/* Background Glowing Leakages */}
      <div className="light-leak bg-[#8083ff]/15 -top-40 -left-40"></div>
      <div className="light-leak bg-[#00ded1]/10 bottom-0 -right-40"></div>

      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 text-on-surface-variant hover:text-primary transition-all duration-300 group z-50 bg-[#13131b]/40 backdrop-blur-md px-4 py-2 border border-white/5 rounded-full"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        <span className="font-label-mono text-xs uppercase tracking-wider">Return Home</span>
      </Link>

      <main className="w-full max-w-[420px] relative z-10 animate-float">
        {/* Glassmorphic Auth Box */}
        <div className="glass-card rounded-[24px] p-8 sm:p-10 shadow-2xl flex flex-col gap-6">
          
          {/* Header Section */}
          <header className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-gradient text-3xl font-bold">terminal</span>
              <h1 className="font-display-xl text-2xl font-bold tracking-tight text-gradient">CodeTogether</h1>
            </div>
            <p className="text-sm text-on-surface-variant text-center leading-relaxed">
              Enter the focus flow. Focus on the code, we'll sync the canvas.
            </p>
          </header>

          {/* Error Message banner */}
          {errorMsg && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-xl text-center text-xs text-error font-body-md animate-pulse">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant px-1">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/40 group-focus-within:text-primary transition-colors text-lg">alternate_email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-[44px] pr-4 py-3.5 text-sm text-[#e5e1e4] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/30 shadow-inner"
                  placeholder="architect@codetogether.io"
                  type="email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-on-surface-variant">Security Token</label>
                <a className="text-[11px] font-bold text-tertiary hover:underline" href="#">Forgot?</a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline/40 group-focus-within:text-primary transition-colors text-lg">lock</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-[44px] pr-12 py-3.5 text-sm text-[#e5e1e4] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline/30 shadow-inner"
                  placeholder="••••••••••••"
                  type={showPassword ? "text" : "password"}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center p-0 m-0 text-outline/40 hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center gap-2.5 px-1 mt-1">
              <input 
                className="w-4 h-4 rounded border-white/10 bg-black/40 text-primary focus:ring-primary/20 cursor-pointer" 
                id="remember" 
                type="checkbox" 
              />
              <label className="text-xs text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                Stay signed in for 30 cycles
              </label>
            </div>

            {/* Submit Button */}
            <button 
              className="mt-4 w-full py-4 bg-primary text-[#0d0096] text-xs uppercase tracking-widest font-black rounded-xl shadow-[0_0_20px_rgba(192,193,255,0.4)] hover:shadow-[0_0_30px_rgba(192,193,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span>Synthesizing...</span>
              ) : (
                <>
                  INITIALIZE SESSION
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-outline/40">CONTINUE FLOW WITH</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? `${window.location.origin}/api` : 'http://localhost:3000/api');
                window.location.href = `${apiBase}/auth/google`;
              }}
              className="bg-white/5 border border-white/10 hover:bg-white/10 py-2.5 flex items-center justify-center gap-2 rounded-xl text-xs uppercase tracking-widest font-bold text-on-surface hover:border-primary/40 transition-all active:scale-95">
              <img alt="Google" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBTcWPwho4E0zjJ8rp5DHpkLgy1p3Fdrk1-oZcXvRyeCctinIlb24JMUUrnEUgae9up4_3xJVEpyfl_wOLSCrsl4vXqcrxZcIiBnTcOD4AI-2Uw6X8dXCfuMkJpZZO8fjMLRKJ7Y_0q2BIXB5gEAgSqgTgPf7pKOL6P-Aaxjwm1587D6jEeRVrXdhRWd_N7yn938G-u8cVhoJOpoEZACK_2bIn2rUSkBF2B2bs51iTPPp7p_QLWjpCAIqvBkBudonWrIMdsxMXCB9t" />
              Google
            </button>
            <button
              onClick={() => {
                const apiBase = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? `${window.location.origin}/api` : 'http://localhost:3000/api');
                window.location.href = `${apiBase}/auth/github`;
              }}
              className="bg-white/5 border border-white/10 hover:bg-white/10 py-2.5 flex items-center justify-center gap-2 rounded-xl text-xs uppercase tracking-widest font-bold text-on-surface hover:border-primary/40 transition-all active:scale-95">
              <img alt="GitHub" className="w-4 h-4 grayscale contrast-200 brightness-200" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4KjIB08yIPSUzpUvSeButn87s7q8W2rmuZ82Qn5VJH5QRfeVZ31v44l_O5FeuTcOKUpvqvKR93qgeThq0iT9RX1eaTjAR5vQZjG4pmRNyF1bg3vhrps1Dwas1V9I6eL57Q7xhpe1C4BeNbhvz6IGI1yZwkMJs-nq6_S0LqJLae1ALIFuU2-FPItM9x5w0FTJyPRcfEEHLHIVtcDj3l9soirfXL8rDhV-dCRRwEmxzo5-5C1W4j7UlETGZyKhPZlk8cVwYsxgIoHzE" />
              GitHub
            </button>
          </div>

          {/* Signup Footer */}
          <footer className="mt-4 pt-6 border-t border-white/5 flex flex-col items-center gap-2">
            <p className="text-xs text-on-surface-variant">Don't have an environment seat?</p>
            <Link className="text-xs uppercase tracking-[0.15em] font-black text-primary hover:text-tertiary transition-colors" to="/signup">
              CREATE AN ACCOUNT
            </Link>
          </footer>
        </div>

        {/* Floating background console cards (Desktop only) */}
        <div className="absolute -z-10 -bottom-16 -right-16 opacity-30 hidden md:block select-none pointer-events-none">
          <pre className="font-label-mono text-[10px] text-tertiary">
            {`{
  "status": "waiting_for_auth",
  "client": "低レイテンシー",
  "version": "v2.0.4-live",
  "security": "quantum-ready"
}`}
          </pre>
        </div>
      </main>

      {/* Joined badge */}
      <div className="fixed bottom-6 left-6 hidden md:flex items-center gap-3 bg-[#13131b]/40 backdrop-blur-md px-4 py-2 border border-white/5 rounded-full select-none">
        <div className="flex -space-x-2">
          <img className="w-6 h-6 rounded-full border border-black" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuHxw0sE32Cva4pR-oSjmDUQTLBA3BzAdnENRPwQdfR3vPjuTklL_ufLwz_tngT-Pf3Z-WX_b7ihSxcLKyMyP34zDsmgXgTtjMrZgOouPZ4iC0IoUBO25ps_zpTDQgFRrpHxvXjDloVWWCOrttqFVPPzJLXcYI0-JeAfZk_6TfNhdgr6Q806j0jkt8Qk8D7bPiCPAvUjbaOvogQg51xqaqPjXfEHWK2hS3-AAqBKt6_k2OrGQvlRfRxmyuuIS1cAl9IK_jOyERSCKl" alt="User 1" />
          <img className="w-6 h-6 rounded-full border border-black" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVr2rRcp7VK_DU2kpQuX8Dj-UI8pjdJLhz6oTemp_akA1UTtgmAyLx0WosK3uLFlBxfwrbycVdRTKcluWBLPuW0jRGP-m6uuNCI5pLFQgDgpNdblPnXj_oSYFl_tq0XLQuuHd7TMi8tm_AD1vBLouwIFKTd4C2FAxNB7WaV9VgUe8xJsOJuj_-MDJSQb6zfUnE88ysKDNCbQYBWThqjl0VumIN4KyYIn0x3t3KI0eLjpAMBFsUpCBLF2R7wKXnUn2VvpKEnhXe1erC" alt="User 2" />
        </div>
        <p className="text-[10px] uppercase tracking-widest font-black text-on-surface-variant">50K+ ARCHITECTS CONNECTED</p>
      </div>
    </div>
  );
};

export default Login;
