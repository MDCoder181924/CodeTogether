import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/group-lobby');
  }


  return (
    <div className="bg-[#0e0e10] flex items-center justify-center min-h-screen p-4 overflow-hidden relative">
      {/* Background Light Effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#adc6ff]/20 rounded-full blur-[100px] z-0"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#c0c1ff]/10 rounded-full blur-[100px] z-0"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-[420px]">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-xl shadow-2xl flex flex-col gap-6 hover:border-white/20 transition-colors">
          {/* Brand Anchor */}
          <header className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#adc6ff] text-[32px]">terminal</span>
              <h1 className="font-sans text-2xl font-bold text-[#e5e1e4] tracking-tight">CodeTogether</h1>
            </div>
            <p className="text-base text-[#c2c6d6] text-center">Focus on the code, we'll handle the sync.</p>
          </header>

          {/* Login Form */}
          <form onSubmit={(e)=>{handleSubmit(e)}} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs uppercase tracking-widest font-semibold text-[#c2c6d6] px-1">EMAIL ADDRESS</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8c909f] group-focus-within:text-[#adc6ff] transition-colors">alternate_email</span>
                <input 
                  className="w-full bg-[#050506] border border-[#424754] rounded-lg pl-[48px] pr-4 py-4 text-base text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/30 transition-all placeholder:text-[#8c909f]/50" 
                  placeholder="architect@codetogether.io" 
                  type="email" 
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs uppercase tracking-widest font-semibold text-[#c2c6d6]">PASSWORD</label>
                <a className="text-xs font-semibold text-[#adc6ff] hover:underline" href="#">Forgot?</a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8c909f] group-focus-within:text-[#adc6ff] transition-colors">lock</span>
                <input 
                  className="w-full bg-[#050506] border border-[#424754] rounded-lg pl-[48px] pr-4 py-4 text-base text-[#e5e1e4] focus:outline-none focus:border-[#adc6ff] focus:ring-2 focus:ring-[#adc6ff]/30 transition-all placeholder:text-[#8c909f]/50" 
                  placeholder="••••••••" 
                  type="password" 
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1 mt-1">
              <input className="w-4 h-4 rounded-sm bg-[#353437] border-[#424754] text-[#adc6ff] focus:ring-[#adc6ff]/30" id="remember" type="checkbox" />
              <label className="text-sm text-[#c2c6d6] cursor-pointer" htmlFor="remember">Stay signed in for 30 days</label>
            </div>

            <button className="mt-4 w-full py-4 bg-[#adc6ff] text-[#002e6a] text-xs uppercase tracking-widest font-bold rounded-lg shadow-[0px_0px_12px_rgba(173,198,255,0.5)] hover:shadow-[0px_0px_20px_rgba(173,198,255,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2" type="submit">
              LOGIN
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>  
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="h-[1px] flex-1 bg-[#424754]"></div>
            <span className="text-xs uppercase tracking-widest font-semibold text-[#8c909f]/60">OR CONTINUE WITH</span>
            <div className="h-[1px] flex-1 bg-[#424754]"></div>
          </div>

          {/* Social Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white/5 border border-white/10 py-2 flex items-center justify-center gap-2 rounded-lg text-xs uppercase tracking-widest font-semibold text-[#e5e1e4] hover:bg-white/10 transition-all active:scale-95">
              <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBTcWPwho4E0zjJ8rp5DHpkLgy1p3Fdrk1-oZcXvRyeCctinIlb24JMUUrnEUgae9up4_3xJVEpyfl_wOLSCrsl4vXqcrxZcIiBnTcOD4AI-2Uw6X8dXCfuMkJpZZO8fjMLRKJ7Y_0q2BIXB5gEAgSqgTgPf7pKOL6P-Aaxjwm1587D6jEeRVrXdhRWd_N7yn938G-u8cVhoJOpoEZACK_2bIn2rUSkBF2B2bs51iTPPp7p_QLWjpCAIqvBkBudonWrIMdsxMXCB9t" />
              Google
            </button>
            <button className="bg-white/5 border border-white/10 py-2 flex items-center justify-center gap-2 rounded-lg text-xs uppercase tracking-widest font-semibold text-[#e5e1e4] hover:bg-white/10 transition-all active:scale-95">
              <span className="material-symbols-outlined text-[20px]">cloud</span>
              SSO
            </button>
          </div>

          {/* Footer Link */}
          <footer className="mt-6 pt-6 border-t border-[#424754] flex flex-col items-center gap-2">
            <p className="text-sm text-[#c2c6d6]">Don't have an account?</p>
            <Link className="text-xs uppercase tracking-widest font-bold text-[#adc6ff] hover:brightness-110 active:scale-95 transition-all" to="/signup">
              CREATE AN ACCOUNT
            </Link>
          </footer>
        </div>

        {/* Decorative Background Content */}
        <div className="absolute -z-10 -bottom-16 -right-16 opacity-20 hidden md:block">
          <pre className="font-mono text-xs text-[#adc6ff] select-none pointer-events-none">
{`{
  "status": "waiting_for_auth",
  "platform": "CodeTogether",
  "version": "2.4.0-stable",
  "security": "AES-256-GCM"
}`}
          </pre>
        </div>
      </main>

      {/* Bottom Info (Desktop only snippet) */}
      <div className="fixed bottom-6 left-6 hidden md:flex items-center gap-4">
        <div className="flex -space-x-2">
          <img className="w-8 h-8 rounded-full border-2 border-[#0e0e10]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuHxw0sE32Cva4pR-oSjmDUQTLBA3BzAdnENRPwQdfR3vPjuTklL_ufLwz_tngT-Pf3Z-WX_b7ihSxcLKyMyP34zDsmgXgTtjMrZgOouPZ4iC0IoUBO25ps_zpTDQgFRrpHxvXjDloVWWCOrttqFVPPzJLXcYI0-JeAfZk_6TfNhdgr6Q806j0jkt8Qk8D7bPiCPAvUjbaOvogQg51xqaqPjXfEHWK2hS3-AAqBKt6_k2OrGQvlRfRxmyuuIS1cAl9IK_jOyERSCKl" alt="User 1" />
          <img className="w-8 h-8 rounded-full border-2 border-[#0e0e10]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVr2rRcp7VK_DU2kpQuX8Dj-UI8pjdJLhz6oTemp_akA1UTtgmAyLx0WosK3uLFlBxfwrbycVdRTKcluWBLPuW0jRGP-m6uuNCI5pLFQgDgpNdblPnXj_oSYFl_tq0XLQuuHd7TMi8tm_AD1vBLouwIFKTd4C2FAxNB7WaV9VgUe8xJsOJuj_-MDJSQb6zfUnE88ysKDNCbQYBWThqjl0VumIN4KyYIn0x3t3KI0eLjpAMBFsUpCBLF2R7wKXnUn2VvpKEnhXe1erC" alt="User 2" />
          <img className="w-8 h-8 rounded-full border-2 border-[#0e0e10]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC133lQU4fSwLdcZICGevBWZ5CsLYh6-9EcBgsgixh-X-w7JMJCnaJgLKbjiKKlITN1WkfAAp7EYgo_AUP4I49FIYEJSwiGLxQPsStzHhVLUI5v3jLtHc-8hWKU12UQGhFANKDxOxTQP6mfBPFngjJ-cJHEHUfypwmBd-KjVophUEm8ja9VrnmvHOfRyN7MI6wMX1zB4ELKyKNhhhCYKUKYqSiBl8d3m_skgpPmmqMrU7o1cvczT0NLoZWqCoW4WzNZEPRKb16pa6x1" alt="User 3" />
        </div>
        <p className="text-xs uppercase tracking-widest font-semibold text-[#8c909f]">JOIN 50K+ ARCHITECTS</p>
      </div>
    </div>
  );
}

export default Login;
